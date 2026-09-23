"use server";

import { revalidatePath } from "next/cache";

import { toActionError } from "@/lib/errors";
import * as attachmentService from "@/lib/services/attachment.service";
import { requireUserId } from "@/lib/session";

export async function deleteAttachmentAction(
  projectId: string,
  listId: string,
  attachmentId: string,
) {
  try {
    const userId = await requireUserId();
    await attachmentService.deleteAttachment(userId, attachmentId);
    revalidatePath(`/projects/${projectId}/lists/${listId}`);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
