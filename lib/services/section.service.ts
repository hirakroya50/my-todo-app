import { db } from "@/lib/db";
import {
  assertListAccess,
  assertSectionAccess,
} from "@/lib/permissions";
import type { SortOrderInput } from "@/lib/types";

export async function createSection(
  userId: string,
  listId: string,
  title: string,
) {
  await assertListAccess(userId, listId);
  const maxOrder = await db.section.aggregate({
    where: { todoListId: listId },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  return db.section.create({
    data: { todoListId: listId, title, sortOrder },
  });
}

export async function updateSection(
  userId: string,
  sectionId: string,
  title: string,
) {
  await assertSectionAccess(userId, sectionId);
  return db.section.update({
    where: { id: sectionId },
    data: { title },
  });
}

export async function deleteSection(userId: string, sectionId: string) {
  await assertSectionAccess(userId, sectionId);
  await db.section.delete({ where: { id: sectionId } });
}

export async function reorderSections(
  userId: string,
  listId: string,
  orders: SortOrderInput[],
) {
  await assertListAccess(userId, listId);
  await db.$transaction(
    orders.map((order) =>
      db.section.updateMany({
        where: { id: order.id, todoListId: listId },
        data: { sortOrder: order.sortOrder },
      }),
    ),
  );
}
