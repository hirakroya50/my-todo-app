import { db } from "@/lib/db";
import {
  assertItemAccess,
  assertSectionAccess,
  resolveItemListId,
} from "@/lib/permissions";
import type { SortOrderInput } from "@/lib/types";

export async function createItem(
  userId: string,
  sectionId: string,
  title: string,
) {
  await assertSectionAccess(userId, sectionId);
  const maxOrder = await db.todoItem.aggregate({
    where: { sectionId },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  return db.todoItem.create({
    data: { sectionId, title, sortOrder },
  });
}

export async function updateItem(
  userId: string,
  itemId: string,
  data: { title?: string; linkUrl?: string | null },
) {
  await assertItemAccess(userId, itemId);
  return db.todoItem.update({
    where: { id: itemId },
    data,
  });
}

export async function setChecked(
  userId: string,
  itemId: string,
  checked: boolean,
) {
  await assertItemAccess(userId, itemId);
  return db.todoItem.update({
    where: { id: itemId },
    data: { checked },
  });
}

export async function deleteItem(userId: string, itemId: string) {
  await assertItemAccess(userId, itemId);
  await db.todoItem.delete({ where: { id: itemId } });
}

export async function reorderItems(
  userId: string,
  sectionId: string,
  orders: SortOrderInput[],
) {
  await assertSectionAccess(userId, sectionId);
  await db.$transaction(
    orders.map((order) =>
      db.todoItem.updateMany({
        where: { id: order.id, sectionId },
        data: { sortOrder: order.sortOrder },
      }),
    ),
  );
}

export async function getListIdForItem(userId: string, itemId: string) {
  return resolveItemListId(userId, itemId);
}
