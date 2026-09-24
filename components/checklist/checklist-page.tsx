"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { updateListAction } from "@/app/actions/lists";
import {
  ProjectAddonsPanel,
  type ProjectAddonClient,
} from "@/components/checklist/project-addons-panel";
import { SectionAccordionItem } from "@/components/checklist/section-accordion";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { computeProgress } from "@/lib/progress";
import type { ListTree } from "@/lib/types";

export function ChecklistPageClient({
  projectId,
  projectAddons,
  tree,
}: {
  projectId: string;
  projectAddons: ProjectAddonClient[];
  tree: ListTree;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [notesOpen, setNotesOpen] = useState(projectAddons.length > 0);
  const [title, setTitle] = useState(tree.list.title);
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tree.sections.map((s) => [s.id, false])),
  );

  const progress = useMemo(() => computeProgress(tree), [tree]);
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
    <div className="flex h-full min-h-0 flex-col bg-gradient-to-b from-primary/5 to-muted/20">
      <div className="sticky top-0 z-20 shrink-0 border-b border-primary/10 bg-background/90 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 py-2">
          <Input
            className="h-7 min-w-[8rem] flex-1 border-transparent bg-transparent px-1 text-sm font-semibold shadow-none focus-visible:border-input focus-visible:bg-background"
            value={title}
            disabled={pending}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
          />
          <div className="flex items-center gap-1.5 text-[11px] tabular-nums text-muted-foreground">
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
              {progress.done}/{progress.total}
            </span>
            <span className="font-medium text-foreground">{progress.percent}%</span>
          </div>
          <Input
            className="h-7 w-full max-w-[10rem] text-xs sm:w-36"
            placeholder="Filter…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="button"
            size="sm"
            variant={filterIncomplete ? "secondary" : "ghost"}
            className="h-7 px-2 text-xs"
            onClick={() => setFilterIncomplete((v) => !v)}
          >
            Todo
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-7 px-2 text-xs"
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
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={() =>
              setExpanded(
                Object.fromEntries(tree.sections.map((s) => [s.id, false])),
              )
            }
          >
            Collapse
          </Button>
        </div>
        <ProjectAddonsPanel
          projectId={projectId}
          initialAddons={projectAddons}
          open={notesOpen}
          onOpenChange={setNotesOpen}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
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
          className="mx-auto w-full max-w-[1600px]"
        >
          {tree.sections.map((section, sectionIndex) => (
            <SectionAccordionItem
              key={section.id}
              projectId={projectId}
              listId={tree.list.id}
              section={section}
              sectionIndex={sectionIndex}
              searchQuery={searchQuery}
              filterIncomplete={filterIncomplete}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
