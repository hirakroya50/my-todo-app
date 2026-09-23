import type { Prisma } from "@prisma/client";

import { getTemplateDefinition } from "@/lib/template/software-dev-todo";

export async function seedListFromTemplate(
  tx: Prisma.TransactionClient,
  todoListId: string,
): Promise<void> {
  const template = getTemplateDefinition();

  for (let sectionIndex = 0; sectionIndex < template.sections.length; sectionIndex++) {
    const sectionDef = template.sections[sectionIndex];
    const section = await tx.section.create({
      data: {
        todoListId,
        title: sectionDef.title,
        sortOrder: sectionIndex,
      },
    });

    if (sectionDef.items.length > 0) {
      await tx.todoItem.createMany({
        data: sectionDef.items.map((title, itemIndex) => ({
          sectionId: section.id,
          title,
          sortOrder: itemIndex,
          checked: false,
        })),
      });
    }
  }
}
