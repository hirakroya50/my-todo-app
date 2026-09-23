"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateListAction } from "@/app/actions/lists";
import { ListAttachmentPanel } from "@/components/checklist/list-attachment-panel";
import { SectionAccordionItem } from "@/components/checklist/section-accordion";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { computeProgress } from "@/lib/progress";
import type { ListTree } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChecklistPageClient({
  projectId,
  tree,
}: {
  projectId: string;
  tree: ListTree;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [title, setTitle] = useState(tree.list.title);
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tree.sections.map((s) => [s.id, false])),
  );

  const progress = useMemo(() => computeProgress(tree), [tree]);
  const listAttachmentCount = tree.attachments.filter((a) => !a.todoItemId).length;

  const openIds = Object.keys(expanded).filter((id) => expanded[id]);

  const saveTitle = () => {
    if (title.trim() === tree.list.title) return;
    startTransition(async () => {
      const result = await updateListAction(projectId, tree.list.id, {
        title: title.trim(),
      });
      if ("error" in result) toast.error("Could not rename list");
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      <div className="sticky top-0 z-20 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2">
          <Input
            className="h-8 min-w-[10rem] flex-1 border-transparent bg-transparent px-1 text-sm font-semibold shadow-none focus-visible:border-input focus-visible:bg-background"
            value={title}
            disabled={pending}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
            <span className="rounded-md bg-muted px-2 py-0.5 font-medium text-foreground">
              {progress.done}/{progress.total}
            </span>
            <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span>{progress.percent}%</span>
          </div>
          <Input
            className="h-8 w-full max-w-[11rem] text-xs sm:w-40"
            placeholder="Filter items…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant={filterIncomplete ? "secondary" : "ghost"}
              className="h-8 px-2 text-xs"
              onClick={() => setFilterIncomplete((v) => !v)}
            >
              Todo
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={() =>
                setExpanded(
                  Object.fromEntries(tree.sections.map((s) => [s.id, true])),
                )
              }
            >
              Expand
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-xs"
              onClick={() =>
                setExpanded(
                  Object.fromEntries(tree.sections.map((s) => [s.id, false])),
                )
              }
            >
              Collapse
            </Button>
            <Button
              type="button"
              size="sm"
              variant={showAttachments ? "secondary" : "ghost"}
              className="h-8 px-2 text-xs"
              onClick={() => setShowAttachments((v) => !v)}
            >
              Files{listAttachmentCount > 0 ? ` (${listAttachmentCount})` : ""}
            </Button>
          </div>
        </div>
        {showAttachments && (
          <div className="mx-auto max-w-6xl border-t px-3 py-2">
            <ListAttachmentPanel
              projectId={projectId}
              listId={tree.list.id}
              attachments={tree.attachments}
              compact
            />
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          value={openIds}
          onValueChange={(ids) => {
            const next: Record<string, boolean> = {};
            for (const section of tree.sections) {
              next[section.id] = ids.includes(section.id);
            }
            setExpanded(next);
          }}
          className={cn("mx-auto max-w-6xl px-2 pb-4")}
        >
          {tree.sections.map((section) => (
            <SectionAccordionItem
              key={section.id}
              projectId={projectId}
              listId={tree.list.id}
              section={section}
              attachments={tree.attachments}
              searchQuery={searchQuery}
              filterIncomplete={filterIncomplete}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
