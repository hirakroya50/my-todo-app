import type { PrismaClient } from "@prisma/client";

import { db } from "@/lib/db";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import type { TodoListWithProject } from "@/lib/types";

type DbLike = Pick<
  PrismaClient,
  "project" | "todoList" | "todoItem" | "section"
>;

export async function getProjectForUser(
  userId: string,
  projectId: string,
  client: DbLike = db,
) {
  return client.project.findFirst({
    where: { id: projectId, userId },
  });
}

export async function getListForUser(
  userId: string,
  todoListId: string,
  client: DbLike = db,
): Promise<TodoListWithProject | null> {
  return client.todoList.findFirst({
    where: {
      id: todoListId,
      project: { userId },
    },
    include: { project: true },
  });
}

export async function assertProjectAccess(
  userId: string,
  projectId: string,
  client: DbLike = db,
) {
  const project = await getProjectForUser(userId, projectId, client);
  if (!project) {
    throw new NotFoundError();
  }
  return project;
}

export async function assertListAccess(
  userId: string,
  todoListId: string,
  client: DbLike = db,
) {
  const list = await getListForUser(userId, todoListId, client);
  if (!list) {
    throw new NotFoundError();
  }
  return list;
}

export async function resolveItemListId(
  userId: string,
  itemId: string,
  client: DbLike = db,
): Promise<string> {
  const item = await client.todoItem.findFirst({
    where: {
      id: itemId,
      section: {
        todoList: {
          project: { userId },
        },
      },
    },
    select: {
      section: { select: { todoListId: true } },
    },
  });

  if (!item) {
    throw new NotFoundError();
  }

  return item.section.todoListId;
}

export async function assertSectionAccess(
  userId: string,
  sectionId: string,
  client: DbLike = db,
) {
  const section = await client.section.findFirst({
    where: {
      id: sectionId,
      todoList: { project: { userId } },
    },
  });
  if (!section) {
    throw new NotFoundError();
  }
  return section;
}

export async function assertItemAccess(
  userId: string,
  itemId: string,
  client: DbLike = db,
) {
  const item = await client.todoItem.findFirst({
    where: {
      id: itemId,
      section: {
        todoList: { project: { userId } },
      },
    },
  });
  if (!item) {
    throw new NotFoundError();
  }
  return item;
}

export function denyIfNotOwner(isOwner: boolean) {
  if (!isOwner) {
    throw new ForbiddenError();
  }
}
