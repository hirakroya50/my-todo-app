"use client";

import { useMemo, useState } from "react";

import { ListAttachmentPanel } from "@/components/checklist/list-attachment-panel";
import { ListHeader } from "@/components/checklist/list-header";
import { ListToolbar } from "@/components/checklist/list-toolbar";
import { SectionAccordionItem } from "@/components/checklist/section-accordion";
import { Accordion } from "@/components/ui/accordion";
import { computeProgress } from "@/lib/progress";
import type { ListTree } from "@/lib/types";

export function ChecklistPageClient({
  projectId,
  tree,
}: {
  projectId: string;
  tree: ListTree;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tree.sections.map((s) => [s.id, true])),
  );

  const progress = useMemo(() => computeProgress(tree), [tree]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-4">
      <ListHeader
        projectId={projectId}
        listId={tree.list.id}
        title={tree.list.title}
        progress={progress}
      />
      <ListAttachmentPanel
        projectId={projectId}
        listId={tree.list.id}
        attachments={tree.attachments}
      />
      <ListToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterIncomplete={filterIncomplete}
        onFilterIncompleteChange={setFilterIncomplete}
        onExpandAll={() =>
          setExpanded(Object.fromEntries(tree.sections.map((s) => [s.id, true])))
        }
        onCollapseAll={() =>
          setExpanded(Object.fromEntries(tree.sections.map((s) => [s.id, false])))
        }
      />
      <Accordion
        type="multiple"
        value={Object.keys(expanded).filter((id) => expanded[id])}
        onValueChange={(ids) => {
          const next: Record<string, boolean> = {};
          for (const section of tree.sections) {
            next[section.id] = ids.includes(section.id);
          }
          setExpanded(next);
        }}
        className="flex-1 overflow-y-auto pr-1"
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
  );
}
