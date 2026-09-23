"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateListAction } from "@/app/actions/lists";
import { Input } from "@/components/ui/input";
import type { ProgressSummary } from "@/lib/types";

export function ListHeader({
  projectId,
  listId,
  title,
  progress,
}: {
  projectId: string;
  listId: string;
  title: string;
  progress: ProgressSummary;
}) {
  const [value, setValue] = useState(title);
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (value.trim() === title) return;
    startTransition(async () => {
      const result = await updateListAction(projectId, listId, {
        title: value.trim(),
      });
      if ("error" in result) toast.error("Could not rename list");
    });
  };

  return (
    <div className="space-y-2 border-b pb-4">
      <Input
        className="text-lg font-semibold"
        value={value}
        disabled={pending}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
      />
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Progress {progress.done} / {progress.total}
        </span>
        <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <span>{progress.percent}%</span>
      </div>
    </div>
  );
}
