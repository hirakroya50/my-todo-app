"use client";

import Image from "next/image";
import { Trash2Icon, UploadIcon } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { deleteAttachmentAction } from "@/app/actions/attachments";
import { Button } from "@/components/ui/button";
import type { ItemAttachment } from "@prisma/client";

export function ListAttachmentPanel({
  projectId,
  listId,
  attachments,
  compact = false,
}: {
  projectId: string;
  listId: string;
  attachments: ItemAttachment[];
  compact?: boolean;
}) {
  const listLevel = attachments.filter((a) => !a.todoItemId);
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

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
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
          className="h-7 text-xs"
          disabled={pending}
          onClick={() => inputRef.current?.click()}
        >
          <UploadIcon className="size-3.5" />
          Upload
        </Button>
        {listLevel.map((att) => (
          <div
            key={att.id}
            className="group relative h-10 w-10 overflow-hidden rounded border"
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
              <Trash2Icon className="size-3 text-white" />
            </button>
          </div>
        ))}
        {listLevel.length === 0 && (
          <span className="text-xs text-muted-foreground">No list screenshots</span>
        )}
      </div>
    );
  }

  return null;
}
