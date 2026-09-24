import { del, put } from "@vercel/blob";

import { db } from "@/lib/db";
import { AppError } from "@/lib/errors";
import {
  assertItemAccess,
  assertListAccess,
} from "@/lib/permissions";

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const DEFAULT_MAX_PER_LIST = 50;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function maxBytes() {
  const env = process.env.MAX_ATTACHMENT_BYTES;
  if (!env) return DEFAULT_MAX_BYTES;
  const n = Number(env);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_BYTES;
}

function maxPerList() {
  const env = process.env.MAX_ATTACHMENTS_PER_LIST;
  if (!env) return DEFAULT_MAX_PER_LIST;
  const n = Number(env);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_PER_LIST;
}

export function validateAttachmentFile(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new AppError("INVALID_FILE_TYPE", "Unsupported file type");
  }
  if (file.size > maxBytes()) {
    throw new AppError("FILE_TOO_LARGE", "File exceeds size limit");
  }
}

export async function enforceAttachmentQuota(listId: string) {
  const count = await db.itemAttachment.count({ where: { todoListId: listId } });
  if (count >= maxPerList()) {
    throw new AppError("QUOTA_EXCEEDED", "Attachment limit reached for this list");
  }
}

export function sanitizeFileName(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  return base || "upload";
}

export async function listAttachmentsForList(userId: string, listId: string) {
  await assertListAccess(userId, listId);
  return db.itemAttachment.findMany({
    where: { todoListId: listId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function uploadAttachment(
  userId: string,
  listId: string,
  file: File,
  todoItemId?: string,
) {
  await assertListAccess(userId, listId);
  if (todoItemId) {
    const item = await assertItemAccess(userId, todoItemId);
    const section = await db.section.findUniqueOrThrow({
      where: { id: item.sectionId },
    });
    if (section.todoListId !== listId) {
      throw new AppError("INVALID_ITEM", "Item does not belong to this list");
    }
  }

  validateAttachmentFile(file);
  await enforceAttachmentQuota(listId);

  const safeName = sanitizeFileName(file.name);
  const pathname = `lists/${listId}/${crypto.randomUUID()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  const maxOrder = await db.itemAttachment.aggregate({
    where: { todoListId: listId },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  try {
    return await db.itemAttachment.create({
      data: {
        todoListId: listId,
        todoItemId: todoItemId ?? null,
        blobUrl: blob.url,
        blobPathname: blob.pathname,
        fileName: file.name,
        mimeType: file.type,
        byteSize: file.size,
        sortOrder,
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

export async function deleteAttachment(userId: string, attachmentId: string) {
  const attachment = await db.itemAttachment.findFirst({
    where: { id: attachmentId },
  });
  if (!attachment) {
    throw new AppError("NOT_FOUND", "Attachment not found");
  }

  try {
    await del(attachment.blobPathname);
  } catch (error) {
    console.error("Blob delete failed", error);
  }

  await db.itemAttachment.delete({ where: { id: attachmentId } });
}
