"use client";

import { TodoItemRow } from "@/components/checklist/todo-item-row";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSectionAccent } from "@/lib/ui/section-accent";
import type { SectionWithItems } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SectionAccordionItem({
  projectId,
  listId,
  section,
  sectionIndex,
  searchQuery,
  filterIncomplete,
}: {
  projectId: string;
  listId: string;
  section: SectionWithItems;
  sectionIndex: number;
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
  const complete = done === section.items.length && section.items.length > 0;
  const accent = getSectionAccent(sectionIndex);

  if (items.length === 0 && (filterIncomplete || searchQuery)) {
    return null;
  }

  return (
    <AccordionItem value={section.id} className="border-border/40">
      <AccordionTrigger
        className={cn(
          "h-9 py-0 hover:no-underline",
          "border-l-4 pl-2",
          accent,
        )}
      >
        <span className="flex-1 truncate text-left text-sm font-semibold text-foreground">
          {section.title}
        </span>
        <span
          className={cn(
            "mr-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums",
            complete
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {done}/{section.items.length}
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-2 pt-1">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
