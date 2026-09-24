"use client";

import { MoreHorizontalIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteItemAction,
  setCheckedAction,
  updateItemAction,
} from "@/app/actions/items";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TodoItem } from "@prisma/client";
import { cn } from "@/lib/utils";

export function TodoItemRow({
  projectId,
  listId,
  item,
}: {
  projectId: string;
  listId: string;
  sectionId: string;
  item: TodoItem;
  sectionItems: TodoItem[];
}) {
  const [checked, setChecked] = useState(item.checked);
  const [title, setTitle] = useState(item.title);
  const [pending, startTransition] = useTransition();

  const toggle = (next: boolean) => {
    setChecked(next);
    startTransition(async () => {
      const result = await setCheckedAction(projectId, listId, item.id, {
        checked: next,
      });
      if ("error" in result) {
        setChecked(!next);
        toast.error("Could not update item");
      }
    });
  };

  const saveTitle = () => {
    if (title.trim() === item.title) return;
    startTransition(async () => {
      const result = await updateItemAction(projectId, listId, item.id, {
        title: title.trim(),
      });
      if ("error" in result) toast.error("Could not save title");
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const result = await deleteItemAction(projectId, listId, item.id);
      if ("error" in result) toast.error("Could not delete item");
    });
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-2 rounded-lg border border-border/60 bg-card/90 p-2 shadow-sm transition-colors hover:border-primary/25 hover:bg-card",
        checked && "opacity-60",
      )}
    >
      <Checkbox
        checked={checked}
        disabled={pending}
        aria-checked={checked}
        onCheckedChange={(v) => toggle(v === true)}
        className="mt-0.5 size-4 shrink-0"
      />
      <textarea
        value={title}
        rows={1}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveTitle}
        disabled={pending}
        className="min-h-[1.25rem] min-w-0 flex-1 resize-none break-words bg-transparent text-sm font-medium leading-snug text-foreground outline-none focus:ring-1 focus:ring-ring/40 rounded-sm"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-6 shrink-0 opacity-0 group-hover:opacity-100"
            aria-label="More"
          >
            <MoreHorizontalIcon className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[7rem]">
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
