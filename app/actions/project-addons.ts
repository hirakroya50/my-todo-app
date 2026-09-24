"use server";

import { revalidatePath } from "next/cache";

import { toActionError } from "@/lib/errors";
import {
  createTextAddonSchema,
  createUrlAddonSchema,
  updateTextAddonSchema,
  updateUrlAddonSchema,
} from "@/lib/schemas/project-addon";
import * as addonService from "@/lib/services/project-addon.service";
import { requireUserId } from "@/lib/session";

function revalidateProject(projectId: string) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`, "layout");
}

export async function createTextAddonAction(projectId: string, input: unknown) {
  try {
    const userId = await requireUserId();
    const data = createTextAddonSchema.parse(input);
    const addon = await addonService.createTextAddon(
      userId,
      projectId,
      data.textContent,
    );
    revalidateProject(projectId);
    return { addon };
  } catch (error) {
    return toActionError(error);
  }
}

export async function createUrlAddonAction(projectId: string, input: unknown) {
  try {
    const userId = await requireUserId();
    const data = createUrlAddonSchema.parse(input);
    const addon = await addonService.createUrlAddon(userId, projectId, data.url);
    revalidateProject(projectId);
    return { addon };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateTextAddonAction(
  projectId: string,
  addonId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = updateTextAddonSchema.parse(input);
    const addon = await addonService.updateTextAddon(
      userId,
      addonId,
      data.textContent,
    );
    revalidateProject(projectId);
    return { addon };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateUrlAddonAction(
  projectId: string,
  addonId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = updateUrlAddonSchema.parse(input);
    const addon = await addonService.updateUrlAddon(userId, addonId, data.url);
    revalidateProject(projectId);
    return { addon };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteProjectAddonAction(
  projectId: string,
  addonId: string,
) {
  try {
    const userId = await requireUserId();
    await addonService.deleteProjectAddon(userId, addonId);
    revalidateProject(projectId);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
