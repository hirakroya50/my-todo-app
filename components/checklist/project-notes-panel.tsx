"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateProjectNotesAction } from "@/app/actions/projects";
import { cn } from "@/lib/utils";

export function ProjectNotesPanel({
  projectId,
  initialNotes,
  open,
  onOpenChange,
}: {
  projectId: string;
  initialNotes: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const save = () => {
    if (notes === initialNotes) return;
    startTransition(async () => {
      const result = await updateProjectNotesAction(projectId, {
        notes: notes.trim() ? notes : null,
      });
      if ("error" in result) toast.error("Could not save notes");
    });
  };

  return (
    <div className="border-t">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        onClick={() => onOpenChange(!open)}
      >
        <span>Project notes</span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <textarea
          className={cn(
            "mx-3 mb-2 min-h-[4rem] w-[calc(100%-1.5rem)] resize-y rounded-md border bg-background px-2 py-1.5 text-xs",
            pending && "opacity-70",
          )}
          placeholder="Links, screenshots context, decisions… (one note for this project)"
          value={notes}
          disabled={pending}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={save}
        />
      )}
    </div>
  );
}
