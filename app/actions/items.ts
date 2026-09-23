"use server";

import { revalidatePath } from "next/cache";

import { toActionError } from "@/lib/errors";
import { reorderSchema } from "@/lib/schemas/common";
import {
  createItemSchema,
  setCheckedSchema,
  updateItemSchema,
} from "@/lib/schemas/item";
import * as itemService from "@/lib/services/todo-item.service";
import * as sectionService from "@/lib/services/section.service";
import { requireUserId } from "@/lib/session";

async function revalidateForList(projectId: string, listId: string) {
  revalidatePath(`/projects/${projectId}/lists/${listId}`);
  revalidatePath("/projects");
}

export async function createSectionAction(
  projectId: string,
  listId: string,
  title: string,
) {
  try {
    const userId = await requireUserId();
    const section = await sectionService.createSection(userId, listId, title);
    await revalidateForList(projectId, listId);
    return { section };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateSectionAction(
  projectId: string,
  listId: string,
  sectionId: string,
  title: string,
) {
  try {
    const userId = await requireUserId();
    const section = await sectionService.updateSection(
      userId,
      sectionId,
      title,
    );
    await revalidateForList(projectId, listId);
    return { section };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteSectionAction(
  projectId: string,
  listId: string,
  sectionId: string,
) {
  try {
    const userId = await requireUserId();
    await sectionService.deleteSection(userId, sectionId);
    await revalidateForList(projectId, listId);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}

export async function reorderSectionsAction(
  projectId: string,
  listId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = reorderSchema.parse(input);
    await sectionService.reorderSections(userId, listId, data.orders);
    await revalidateForList(projectId, listId);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}

export async function createItemAction(
  projectId: string,
  listId: string,
  sectionId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = createItemSchema.parse(input);
    const item = await itemService.createItem(userId, sectionId, data.title);
    await revalidateForList(projectId, listId);
    return { item };
  } catch (error) {
    return toActionError(error);
  }
}

export async function updateItemAction(
  projectId: string,
  listId: string,
  itemId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = updateItemSchema.parse(input);
    const item = await itemService.updateItem(userId, itemId, data);
    await revalidateForList(projectId, listId);
    return { item };
  } catch (error) {
    return toActionError(error);
  }
}

export async function setCheckedAction(
  projectId: string,
  listId: string,
  itemId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = setCheckedSchema.parse(input);
    const item = await itemService.setChecked(userId, itemId, data.checked);
    await revalidateForList(projectId, listId);
    return { item };
  } catch (error) {
    return toActionError(error);
  }
}

export async function deleteItemAction(
  projectId: string,
  listId: string,
  itemId: string,
) {
  try {
    const userId = await requireUserId();
    await itemService.deleteItem(userId, itemId);
    await revalidateForList(projectId, listId);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}

export async function reorderItemsAction(
  projectId: string,
  listId: string,
  sectionId: string,
  input: unknown,
) {
  try {
    const userId = await requireUserId();
    const data = reorderSchema.parse(input);
    await itemService.reorderItems(userId, sectionId, data.orders);
    await revalidateForList(projectId, listId);
    return { success: true };
  } catch (error) {
    return toActionError(error);
  }
}
