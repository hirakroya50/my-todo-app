"use client";

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
  searchQuery,
  filterIncomplete,
}: {
  projectId: string;
  listId: string;
  section: SectionWithItems;
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

  return (
    <AccordionItem value={section.id} className="border-border/50">
      <AccordionTrigger className="py-1.5 hover:no-underline">
        <span className="flex-1 truncate text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {section.title}
        </span>
        <span className="mr-1 rounded bg-muted px-1 py-0.5 text-[10px] font-medium tabular-nums">
          {done}/{section.items.length}
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-1">
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <TodoItemRow
              key={item.id}
              projectId={projectId}
              listId={listId}
              sectionId={section.id}
              item={item}
              sectionItems={section.items}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
