import { db } from "@/lib/db";
import { assertListAccess, assertProjectAccess } from "@/lib/permissions";
import { seedListFromTemplate } from "@/lib/template/seed";
import type { ListTree } from "@/lib/types";

export async function listTodoListsByProject(userId: string, projectId: string) {
  await assertProjectAccess(userId, projectId);
  return db.todoList.findMany({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFullTree(userId: string, listId: string): Promise<ListTree> {
  await assertListAccess(userId, listId);
  const list = await db.todoList.findUniqueOrThrow({
    where: { id: listId },
  });
  const sections = await db.section.findMany({
    where: { todoListId: listId },
    orderBy: { sortOrder: "asc" },
    include: {
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
  const attachments = await db.itemAttachment.findMany({
    where: { todoListId: listId },
    orderBy: { sortOrder: "asc" },
  });
  return { list, sections, attachments };
}

async function nextListSortOrder(projectId: string) {
  const maxOrder = await db.todoList.aggregate({
    where: { projectId },
    _max: { sortOrder: true },
  });
  return (maxOrder._max.sortOrder ?? -1) + 1;
}

export async function createBlankList(
  userId: string,
  projectId: string,
  title: string,
) {
  await assertProjectAccess(userId, projectId);
  const sortOrder = await nextListSortOrder(projectId);
  return db.todoList.create({
    data: { projectId, title, sortOrder },
  });
}

export async function createListFromTemplate(
  userId: string,
  projectId: string,
  title: string,
) {
  await assertProjectAccess(userId, projectId);
  const sortOrder = await nextListSortOrder(projectId);
  return db.$transaction(async (tx) => {
    const list = await tx.todoList.create({
      data: { projectId, title, sortOrder },
    });
    await seedListFromTemplate(tx, list.id);
    return list;
  });
}

export async function updateList(userId: string, listId: string, title: string) {
  await assertListAccess(userId, listId);
  return db.todoList.update({
    where: { id: listId },
    data: { title },
  });
}

export async function deleteList(userId: string, listId: string) {
  await assertListAccess(userId, listId);
  await db.todoList.delete({ where: { id: listId } });
}
