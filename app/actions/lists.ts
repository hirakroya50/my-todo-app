"use server";

import { revalidatePath } from "next/cache";

import { toActionError } from "@/lib/errors";
import { createListSchema, updateListSchema } from "@/lib/schemas/list";
import * as listService from "@/lib/services/todo-list.service";
import { requireUserId } from "@/lib/session";

function revalidateListPaths(projectId: string, listId?: string) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  if (listId) {
    revalidatePath(`/projects/${projectId}/lists/${listId}`);
  }
}

export async function createListAction(projectId: string, input: unknown) {
  try {
    const userId = await requireUserId();
    const data = createListSchema.parse(input);
    const list =
      data.mode === "template"
        ? await listService.createListFromTemplate(
            userId,
            projectId,
            data.title,
          )
        : await listService.createBlankList(userId, projectId, data.title);
    revalidateListPaths(projectId, list.id);
    return { list };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateListAction(
  projectId: string,
  listId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = updateListSchema.parse(input);
    if (!data.title) return { error: "VALIDATION" };
    const list = await listService.updateList(userId, listId, data.title);
    revalidateListPaths(projectId, listId);
    return { list };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteListAction(projectId: string, listId: string) {
  try {
    const userId = await requireUserId();
    await listService.deleteList(userId, listId);
    revalidateListPaths(projectId);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
