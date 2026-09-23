import { db } from "@/lib/db";
import { assertProjectAccess } from "@/lib/permissions";
import type { SortOrderInput } from "@/lib/types";

export async function listProjects(userId: string) {
  return db.project.findMany({
    where: { userId },
    orderBy: { sortOrder: "asc" },
    include: {
      todoLists: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createProject(userId: string, name: string) {
  const maxOrder = await db.project.aggregate({
    where: { userId },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  return db.project.create({
    data: { userId, name, sortOrder },
  });
}

export async function updateProject(
  userId: string,
  projectId: string,
  name: string,
) {
  await assertProjectAccess(userId, projectId);
  return db.project.update({
    where: { id: projectId },
    data: { name },
  });
}

export async function deleteProject(userId: string, projectId: string) {
  await assertProjectAccess(userId, projectId);
  await db.project.delete({ where: { id: projectId } });
}

export async function reorderProjects(
  userId: string,
  orders: SortOrderInput[],
) {
  await db.$transaction(
    orders.map((order) =>
      db.project.updateMany({
        where: { id: order.id, userId },
        data: { sortOrder: order.sortOrder },
      }),
    ),
  );
}
