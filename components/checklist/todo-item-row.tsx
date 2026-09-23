"use client";

import {
  ExternalLinkIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PaperclipIcon,
} from "lucide-react";
import { useRef, useState, useTransition } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { TodoItem } from "@prisma/client";
import { cn } from "@/lib/utils";

export function TodoItemRow({
  projectId,
  listId,
  sectionId,
  item,
  attachmentCount,
  sectionItems,
}: {
  projectId: string;
  listId: string;
  sectionId: string;
  item: TodoItem;
  attachmentCount: number;
  sectionItems: TodoItem[];
}) {
  const [checked, setChecked] = useState(item.checked);
  const [title, setTitle] = useState(item.title);
  const [linkUrl, setLinkUrl] = useState(item.linkUrl ?? "");
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

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

  const saveLink = () => {
    startTransition(async () => {
      const result = await updateItemAction(projectId, listId, item.id, {
        linkUrl: linkUrl.trim() ? linkUrl.trim() : null,
      });
      if ("error" in result) toast.error("Invalid URL");
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

  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("todoItemId", item.id);
    const res = await fetch(`/api/lists/${listId}/attachments`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      toast.error("Upload failed");
      return;
    }
    toast.success("Attached to item");
    window.location.reload();
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-sm px-1 py-0.5 hover:bg-muted/60",
        checked && "opacity-60",
      )}
    >
      <Checkbox
        checked={checked}
        disabled={pending}
        aria-checked={checked}
        onCheckedChange={(v) => toggle(v === true)}
        className="size-3.5 shrink-0"
      />
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          className="h-6 min-w-0 flex-1 truncate bg-transparent text-[13px] leading-tight outline-none focus:ring-1 focus:ring-ring/40 rounded-sm px-0.5"
        />
        {item.linkUrl && (
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-primary hover:text-primary/80"
            title={item.linkUrl}
          >
            <ExternalLinkIcon className="size-3" />
          </a>
        )}
        {attachmentCount > 0 && (
          <span className="shrink-0 text-[10px] text-muted-foreground" title="Attachments">
            <PaperclipIcon className="size-3 inline" />
            {attachmentCount}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-6"
              aria-label="Set link"
            >
              <LinkIcon className="size-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Link URL</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="https://…"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button type="button" size="sm" onClick={saveLink} disabled={pending}>
              Save
            </Button>
          </DialogContent>
        </Dialog>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-6"
          aria-label="Upload screenshot"
          onClick={() => fileRef.current?.click()}
        >
          <PaperclipIcon className="size-3" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-6"
              aria-label="More"
            >
              <MoreHorizontalIcon className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[8rem]">
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
    </div>
  );
}
