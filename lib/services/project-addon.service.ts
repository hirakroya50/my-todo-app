import { del, put } from "@vercel/blob";

import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { assertProjectAccess } from "@/lib/permissions";
import {
  sanitizeFileName,
  validateAttachmentFile,
} from "@/lib/services/attachment.service";
import type { ProjectAddon, ProjectAddonType } from "@prisma/client";

async function nextSortOrder(projectId: string) {
  const max = await db.projectAddon.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });
  return (max._max.sortOrder ?? -1) + 1;
}

export async function listProjectAddons(
  userId: string,
  projectId: string,
): Promise<ProjectAddon[]> {
  await assertProjectAccess(userId, projectId);
  return db.projectAddon.findMany({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createTextAddon(
  userId: string,
  projectId: string,
  textContent?: string,
) {
  await assertProjectAccess(userId, projectId);
  const sortOrder = await nextSortOrder(projectId);
  return db.projectAddon.create({
    data: {
      projectId,
      type: "TEXT",
      sortOrder,
      textContent: textContent ?? "",
    },
  });
}

export async function createUrlAddon(
  userId: string,
  projectId: string,
  url: string,
) {
  await assertProjectAccess(userId, projectId);
  const sortOrder = await nextSortOrder(projectId);
  return db.projectAddon.create({
    data: {
      projectId,
      type: "URL",
      sortOrder,
      url,
    },
  });
}

export async function uploadImageAddon(
  userId: string,
  projectId: string,
  file: File,
) {
  await assertProjectAccess(userId, projectId);
  validateAttachmentFile(file);

  const safeName = sanitizeFileName(file.name);
  const pathname = `projects/${projectId}/${crypto.randomUUID()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  const sortOrder = await nextSortOrder(projectId);

  try {
    return await db.projectAddon.create({
      data: {
        projectId,
        type: "IMAGE",
        sortOrder,
        imageUrl: blob.url,
        imagePathname: blob.pathname,
      },
    });
  } catch (error) {
    try {
      await del(blob.pathname);
    } catch (delError) {
      console.error("Failed to rollback blob after DB error", delError);
    }
    throw error;
  }
}

async function getOwnedAddon(userId: string, addonId: string) {
  const addon = await db.projectAddon.findFirst({
    where: { id: addonId, project: { userId } },
  });
  if (!addon) {
    throw new AppError("NOT_FOUND", "Add-on not found");
  }
  return addon;
}

export async function updateTextAddon(
  userId: string,
  addonId: string,
  textContent: string,
) {
  const addon = await getOwnedAddon(userId, addonId);
  if (addon.type !== "TEXT") {
    throw new AppError("INVALID", "Not a text add-on");
  }
  return db.projectAddon.update({
    where: { id: addonId },
    data: { textContent },
  });
}

export async function updateUrlAddon(
  userId: string,
  addonId: string,
  url: string,
) {
  const addon = await getOwnedAddon(userId, addonId);
  if (addon.type !== "URL") {
    throw new AppError("INVALID", "Not a URL add-on");
  }
  return db.projectAddon.update({
    where: { id: addonId },
    data: { url },
  });
}

export async function deleteProjectAddon(userId: string, addonId: string) {
  const addon = await getOwnedAddon(userId, addonId);
  if (addon.type === "IMAGE" && addon.imagePathname) {
    try {
      await del(addon.imagePathname);
    } catch (error) {
      console.error("Blob delete failed", error);
    }
  }
  await db.projectAddon.delete({ where: { id: addonId } });
}

export type ProjectAddonDto = {
  id: string;
  type: ProjectAddonType;
  sortOrder: number;
  textContent: string | null;
  url: string | null;
  imageUrl: string | null;
};
