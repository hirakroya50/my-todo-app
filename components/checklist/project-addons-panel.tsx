"use client";

import type { ProjectAddonType } from "@prisma/client";
import {
  ImageIcon,
  LinkIcon,
  PlusIcon,
  TextIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createTextAddonAction,
  createUrlAddonAction,
  deleteProjectAddonAction,
  updateTextAddonAction,
  updateUrlAddonAction,
} from "@/app/actions/project-addons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ProjectAddonClient = {
  id: string;
  type: ProjectAddonType;
  sortOrder: number;
  textContent: string | null;
  url: string | null;
  imageUrl: string | null;
};

export function ProjectAddonsPanel({
  projectId,
  initialAddons,
  open,
  onOpenChange,
}: {
  projectId: string;
  initialAddons: ProjectAddonClient[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const addons = initialAddons;
  const [pending, startTransition] = useTransition();
  const [urlDraft, setUrlDraft] = useState("");
  const [showUrlForm, setShowUrlForm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => router.refresh();

  const addText = () => {
    startTransition(async () => {
      const result = await createTextAddonAction(projectId, {});
      if ("error" in result) {
        toast.error("Could not add note");
        return;
      }
      refresh();
    });
  };

  const submitUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed) return;
    startTransition(async () => {
      const result = await createUrlAddonAction(projectId, { url: trimmed });
      if ("error" in result) {
        toast.error("Invalid URL");
        return;
      }
      setUrlDraft("");
      setShowUrlForm(false);
      refresh();
    });
  };

  const onPickImage = () => fileRef.current?.click();

  const onImageSelected = async (file: File | undefined) => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`/api/projects/${projectId}/addons/upload`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }
      refresh();
    } catch {
      toast.error("Upload failed");
    }
  };

  const saveText = (addonId: string, textContent: string) => {
    startTransition(async () => {
      const result = await updateTextAddonAction(projectId, addonId, {
        textContent,
      });
      if ("error" in result) toast.error("Could not save");
    });
  };

  const saveUrl = (addonId: string, url: string) => {
    startTransition(async () => {
      const result = await updateUrlAddonAction(projectId, addonId, { url });
      if ("error" in result) toast.error("Could not save link");
    });
  };

  const remove = (addonId: string) => {
    startTransition(async () => {
      const result = await deleteProjectAddonAction(projectId, addonId);
      if ("error" in result) toast.error("Could not delete");
      else refresh();
    });
  };

  return (
    <div className="border-t border-primary/10">
      <div className="flex items-center justify-between px-3 py-1.5">
        <button
          type="button"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => onOpenChange(!open)}
        >
          Project notes
          <span className="ml-1 text-[10px] font-normal">({addons.length})</span>
        </button>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="size-7"
                aria-label="Add note block"
                disabled={pending}
              >
                <PlusIcon className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={addText}>
                <TextIcon className="mr-2 size-3.5" />
                Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowUrlForm(true)}>
                <LinkIcon className="mr-2 size-3.5" />
                Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onPickImage}>
                <ImageIcon className="mr-2 size-3.5" />
                Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              void onImageSelected(file);
            }}
          />
          <button
            type="button"
            className="px-1 text-xs text-muted-foreground"
            onClick={() => onOpenChange(!open)}
          >
            {open ? "−" : "+"}
          </button>
        </div>
      </div>
      {open && (
        <div className="space-y-2 px-3 pb-3">
          {showUrlForm && (
            <div className="flex gap-1">
              <Input
                className="h-8 text-xs"
                placeholder="https://…"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitUrl()}
              />
              <Button
                type="button"
                size="sm"
                className="h-8 shrink-0"
                disabled={pending}
                onClick={submitUrl}
              >
                Add
              </Button>
            </div>
          )}
          {addons.length === 0 && !showUrlForm && (
            <p className="text-xs text-muted-foreground">
              Add text, links, or screenshots for this project.
            </p>
          )}
          {addons.map((addon) => (
            <AddonCard
              key={`${addon.id}:${addon.textContent ?? ""}:${addon.url ?? ""}:${addon.imageUrl ?? ""}`}
              addon={addon}
              pending={pending}
              onSaveText={saveText}
              onSaveUrl={saveUrl}
              onDelete={() => remove(addon.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddonCard({
  addon,
  pending,
  onSaveText,
  onSaveUrl,
  onDelete,
}: {
  addon: ProjectAddonClient;
  pending: boolean;
  onSaveText: (id: string, text: string) => void;
  onSaveUrl: (id: string, url: string) => void;
  onDelete: () => void;
}) {
  const [text, setText] = useState(addon.textContent ?? "");
  const [url, setUrl] = useState(addon.url ?? "");

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border/70 bg-card/90 p-2 shadow-sm",
        pending && "opacity-80",
      )}
    >
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute right-1 top-1 size-6 text-muted-foreground hover:text-destructive"
        aria-label="Delete"
        onClick={onDelete}
      >
        <Trash2Icon className="size-3" />
      </Button>
      {addon.type === "TEXT" && (
        <textarea
          className="min-h-[3rem] w-full resize-y bg-transparent pr-7 text-sm text-foreground outline-none"
          placeholder="Write a note…"
          value={text}
          disabled={pending}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            if (text !== (addon.textContent ?? "")) onSaveText(addon.id, text);
          }}
        />
      )}
      {addon.type === "URL" && (
        <div className="space-y-1 pr-6">
          <Input
            className="h-8 text-xs"
            value={url}
            disabled={pending}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => {
              if (url !== (addon.url ?? "")) onSaveUrl(addon.id, url);
            }}
          />
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-xs text-primary underline-offset-2 hover:underline"
            >
              Open link
            </a>
          )}
        </div>
      )}
      {addon.type === "IMAGE" && addon.imageUrl && (
        <a
          href={addon.imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block pr-6"
        >
          <Image
            src={addon.imageUrl}
            alt="Project screenshot"
            width={400}
            height={240}
            unoptimized
            className="max-h-40 w-auto rounded-md border object-contain"
          />
        </a>
      )}
    </div>
  );
}
