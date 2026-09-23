"use client";

import Image from "next/image";
import { ChevronDownIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteAttachmentAction } from "@/app/actions/attachments";
import { Button } from "@/components/ui/button";
import type { ItemAttachment } from "@prisma/client";
import { cn } from "@/lib/utils";

export function ListAttachmentPanel({
  projectId,
  listId,
  attachments,
}: {
  projectId: string;
  listId: string;
  attachments: ItemAttachment[];
}) {
  const listLevel = attachments.filter((a) => !a.todoItemId);
  const [open, setOpen] = useState(listLevel.length > 0);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/lists/${listId}/attachments`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error ?? "Upload failed");
      return;
    }
    toast.success("Screenshot uploaded");
    window.location.reload();
  };

  const onDelete = (attachmentId: string) => {
    startTransition(async () => {
      const result = await deleteAttachmentAction(
        projectId,
        listId,
        attachmentId,
      );
      if ("error" in result) toast.error("Delete failed");
      else toast.success("Attachment removed");
    });
  };

  return (
    <div className="rounded-lg border">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium"
        onClick={() => setOpen((v) => !v)}
      >
        <span>List attachments ({listLevel.length})</span>
        <ChevronDownIcon
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t px-3 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
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
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => inputRef.current?.click()}
            >
              <UploadIcon className="size-4" />
              Upload
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {listLevel.map((att) => (
              <div
                key={att.id}
                className="group relative h-16 w-16 overflow-hidden rounded border"
              >
                <Image
                  src={att.blobUrl}
                  alt={att.fileName}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                  onClick={() => onDelete(att.id)}
                  aria-label="Delete attachment"
                >
                  <Trash2Icon className="size-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
