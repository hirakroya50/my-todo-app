import type { Prisma } from "@prisma/client";

import { getTemplateDefinition } from "@/lib/template/software-dev-todo";

export async function seedListFromTemplate(
  tx: Prisma.TransactionClient,
  todoListId: string,
): Promise<void> {
  const template = getTemplateDefinition();
  const itemRows: {
    sectionId: string;
    title: string;
    sortOrder: number;
    checked: boolean;
  }[] = [];

  for (let sectionIndex = 0; sectionIndex < template.sections.length; sectionIndex++) {
    const sectionDef = template.sections[sectionIndex];
    const section = await tx.section.create({
      data: {
        todoListId,
        title: sectionDef.title,
        sortOrder: sectionIndex,
      },
    });

    for (let itemIndex = 0; itemIndex < sectionDef.items.length; itemIndex++) {
      itemRows.push({
        sectionId: section.id,
        title: sectionDef.items[itemIndex],
        sortOrder: itemIndex,
        checked: false,
      });
    }
  }

  if (itemRows.length > 0) {
    await tx.todoItem.createMany({ data: itemRows });
  }
}
