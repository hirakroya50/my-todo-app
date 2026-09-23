"use client";

import { ExternalLinkIcon, LinkIcon, MoreVerticalIcon, PaperclipIcon } from "lucide-react";
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
        "flex items-start gap-2 rounded-md border p-2",
        checked && "opacity-70",
      )}
    >
      <Checkbox
        checked={checked}
        disabled={pending}
        aria-checked={checked}
        onCheckedChange={(v) => toggle(v === true)}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        {item.linkUrl && (
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <ExternalLinkIcon className="size-3" />
            Link
          </a>
        )}
      </div>
      <div className="flex items-center gap-1">
        {attachmentCount > 0 && (
          <span className="text-xs text-muted-foreground" title="Attachments">
            <PaperclipIcon className="size-3.5 inline" /> {attachmentCount}
          </span>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Set link">
              <LinkIcon className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Item link URL</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="https://…"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Button type="button" onClick={saveLink} disabled={pending}>
              Save link
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
          aria-label="Upload screenshot"
          onClick={() => fileRef.current?.click()}
        >
          <PaperclipIcon className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="More">
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canMoveUp && (
              <DropdownMenuItem onClick={() => move("up")}>Move up</DropdownMenuItem>
            )}
            {canMoveDown && (
              <DropdownMenuItem onClick={() => move("down")}>Move down</DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onDelete}>Delete item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
