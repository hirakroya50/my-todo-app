"use client";

import { MoreHorizontalIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteItemAction,
  reorderItemsAction,
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
  sectionId,
  item,
  sectionItems,
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

  const index = sectionItems.findIndex((i) => i.id === item.id);
  const canMoveUp = index > 0;
  const canMoveDown = index >= 0 && index < sectionItems.length - 1;

  const move = (direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sectionItems.length) return;
    const orders = sectionItems.map((row, i) => {
      if (i === index) return { id: row.id, sortOrder: swapIndex };
      if (i === swapIndex) return { id: row.id, sortOrder: index };
      return { id: row.id, sortOrder: i };
    });
    startTransition(async () => {
      const result = await reorderItemsAction(projectId, listId, sectionId, {
        orders,
      });
      if ("error" in result) toast.error("Could not reorder");
    });
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 rounded-sm px-0.5 py-0.5 hover:bg-muted/60",
        checked && "opacity-55",
      )}
    >
      <Checkbox
        checked={checked}
        disabled={pending}
        aria-checked={checked}
        onCheckedChange={(v) => toggle(v === true)}
        className="size-3.5 shrink-0"
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={saveTitle}
        className="h-5 min-w-0 flex-1 truncate bg-transparent text-[12px] leading-tight outline-none focus:ring-1 focus:ring-ring/30 rounded-sm px-0.5"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-5 shrink-0 opacity-0 group-hover:opacity-100"
            aria-label="More"
          >
            <MoreHorizontalIcon className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[7rem]">
          {canMoveUp && (
            <DropdownMenuItem onClick={() => move("up")}>Move up</DropdownMenuItem>
          )}
          {canMoveDown && (
            <DropdownMenuItem onClick={() => move("down")}>Move down</DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
