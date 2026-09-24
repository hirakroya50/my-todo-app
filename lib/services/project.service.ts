import { db } from "@/lib/db";
import { assertProjectAccess } from "@/lib/permissions";
import { seedListFromTemplate } from "@/lib/template/seed";
import type { SortOrderInput } from "@/lib/types";

const DEFAULT_LIST_TITLE = "Development checklist";

export async function listProjects() {
  return db.project.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      todoLists: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });
}

export async function getProjectNotes(userId: string, projectId: string) {
  const project = await assertProjectAccess(userId, projectId);
  return project.notes ?? "";
}

export async function createProjectWithChecklist(userId: string, name: string) {
  const maxOrder = await db.project.aggregate({
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  return db.$transaction(
    async (tx) => {
      const project = await tx.project.create({
        data: { userId, name, sortOrder },
      });
      const list = await tx.todoList.create({
        data: {
          projectId: project.id,
          title: DEFAULT_LIST_TITLE,
          sortOrder: 0,
        },
      });
      await seedListFromTemplate(tx, list.id);
      return { project, list };
    },
    { maxWait: 30_000, timeout: 120_000 },
  );
}

/** @deprecated Use createProjectWithChecklist */
export async function createProject(userId: string, name: string) {
  const { project } = await createProjectWithChecklist(userId, name);
  return project;
}

export async function ensureProjectChecklist(userId: string, projectId: string) {
  await assertProjectAccess(userId, projectId);
  const existing = await db.todoList.findFirst({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });
  if (existing) return existing;

  return db.$transaction(
    async (tx) => {
      const list = await tx.todoList.create({
        data: {
          projectId,
          title: DEFAULT_LIST_TITLE,
          sortOrder: 0,
        },
      });
      await seedListFromTemplate(tx, list.id);
      return list;
    },
    { maxWait: 30_000, timeout: 120_000 },
  );
}

export async function getDefaultListIdForProject(
  userId: string,
  projectId: string,
) {
  const list = await ensureProjectChecklist(userId, projectId);
  return list.id;
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

export async function updateProjectNotes(
  userId: string,
  projectId: string,
  notes: string | null,
) {
  await assertProjectAccess(userId, projectId);
  return db.project.update({
    where: { id: projectId },
    data: { notes },
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
        where: { id: order.id },
        data: { sortOrder: order.sortOrder },
      }),
    ),
  );
}
