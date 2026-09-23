"use client";

import type { ItemAttachment } from "@prisma/client";

import { TodoItemRow } from "@/components/checklist/todo-item-row";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { SectionWithItems } from "@/lib/types";

export function SectionAccordionItem({
  projectId,
  listId,
  section,
  attachments,
  searchQuery,
  filterIncomplete,
}: {
  projectId: string;
  listId: string;
  section: SectionWithItems;
  attachments: ItemAttachment[];
  searchQuery: string;
  filterIncomplete: boolean;
}) {
  const items = section.items.filter((item) => {
    if (filterIncomplete && item.checked) return false;
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const done = section.items.filter((i) => i.checked).length;

  if (items.length === 0 && (filterIncomplete || searchQuery)) {
    return null;
  }

  const attachmentCountByItem = (itemId: string) =>
    attachments.filter((a) => a.todoItemId === itemId).length;

  return (
    <AccordionItem value={section.id}>
      <AccordionTrigger className="sticky top-0 z-10 bg-background/95 backdrop-blur">
        <span className="flex-1 text-left">{section.title}</span>
        <span className="mr-2 text-xs text-muted-foreground">
          {done}/{section.items.length}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-2 lg:grid-cols-2">
          {items.map((item) => (
            <TodoItemRow
              key={item.id}
              projectId={projectId}
              listId={listId}
              sectionId={section.id}
              item={item}
              sectionItems={section.items}
              attachmentCount={attachmentCountByItem(item.id)}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
