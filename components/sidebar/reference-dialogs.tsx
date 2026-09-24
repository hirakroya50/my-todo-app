"use client";

import { BookOpenIcon, GitBranchIcon, ListChecksIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DISCOVERY_CHECKLIST } from "@/lib/reference/discovery-checklist";
import { PHASES_SUMMARY } from "@/lib/reference/phases-summary";
import { WORKFLOW_LADDER_STEPS } from "@/lib/reference/workflow-ladder";

function WorkflowBody() {
  return (
    <ol className="space-y-1 text-xs leading-relaxed">
      {WORKFLOW_LADDER_STEPS.map((step, i) => (
        <li key={step} className="flex gap-2">
          <span className="shrink-0 font-medium text-muted-foreground">
            {i + 1}.
          </span>
          <span>{step}</span>
          {i < WORKFLOW_LADDER_STEPS.length - 1 && (
            <span className="sr-only">then</span>
          )}
        </li>
      ))}
    </ol>
  );
}

function PhasesBody() {
  return (
    <div className="space-y-3 text-xs">
      {PHASES_SUMMARY.map((phase) => (
        <div key={phase.title}>
          <h4 className="font-semibold text-foreground">{phase.title}</h4>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground">
            {phase.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ChecklistBody() {
  return (
    <div className="space-y-3 text-xs">
      {DISCOVERY_CHECKLIST.map((section) => (
        <div key={section.title}>
          <h4 className="font-semibold">{section.title}</h4>
          <ul className="mt-1 space-y-1">
            {section.items.map((item) => (
              <li key={item} className="flex gap-1.5 text-muted-foreground">
                <span className="text-foreground">☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function ReferenceDialogs() {
  return (
    <div className="space-y-1 border-t pt-2">
      <p className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Guides
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-full justify-start gap-1.5 px-2 text-xs"
          >
            <GitBranchIcon className="size-3.5 shrink-0" />
            Workflow
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Development workflow</DialogTitle>
          </DialogHeader>
          <WorkflowBody />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-full justify-start gap-1.5 px-2 text-xs"
          >
            <BookOpenIcon className="size-3.5 shrink-0" />
            Phases
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Phase summary</DialogTitle>
          </DialogHeader>
          <PhasesBody />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-full justify-start gap-1.5 px-2 text-xs"
          >
            <ListChecksIcon className="size-3.5 shrink-0" />
            Checklist
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Discovery & delivery checklist</DialogTitle>
          </DialogHeader>
          <ChecklistBody />
        </DialogContent>
      </Dialog>
    </div>
  );
}
