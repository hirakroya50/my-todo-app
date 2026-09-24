"use client";

import {
  ArrowDownIcon,
  BookOpenIcon,
  GitBranchIcon,
  ListChecksIcon,
} from "lucide-react";

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
import { cn } from "@/lib/utils";

function WorkflowBody() {
  return (
    <div className="rounded-lg bg-gradient-to-b from-primary/10 to-transparent p-3">
      <ol className="space-y-0">
        {WORKFLOW_LADDER_STEPS.map((step, i) => (
          <li key={step} className="flex flex-col items-center">
            <div className="flex w-full gap-3 rounded-lg border border-primary/15 bg-card/80 px-3 py-2 shadow-sm">
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
              >
                {i + 1}
              </span>
              <span className="flex-1 text-sm leading-snug text-foreground">
                {step}
              </span>
            </div>
            {i < WORKFLOW_LADDER_STEPS.length - 1 && (
              <ArrowDownIcon
                className="my-1 size-4 text-primary/60"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function PhasesBody() {
  return (
    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
      {PHASES_SUMMARY.map((phase) => (
        <div
          key={phase.title}
          className="rounded-lg border border-border/60 bg-muted/30 p-3"
        >
          <h4 className="font-semibold text-primary">{phase.title}</h4>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
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
    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
      {DISCOVERY_CHECKLIST.map((section) => (
        <div
          key={section.title}
          className="rounded-lg border border-border/60 bg-muted/30 p-3"
        >
          <h4 className="font-semibold text-foreground">{section.title}</h4>
          <ul className="mt-2 space-y-1">
            {section.items.map((item) => (
              <li key={item} className="flex gap-2 text-muted-foreground">
                <span className="text-primary">☐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const guideStyles = {
  workflow: "bg-violet-500/10 hover:bg-violet-500/20 text-violet-900 dark:text-violet-100",
  phases: "bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-900 dark:text-indigo-100",
  checklist:
    "bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-900 dark:text-fuchsia-100",
} as const;

export function ReferenceDialogs() {
  return (
    <div className="space-y-1 border-t border-primary/10 pt-2">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Guides
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              "h-7 w-full justify-start gap-1.5 px-2 text-xs",
              guideStyles.workflow,
            )}
          >
            <GitBranchIcon className="size-3.5 shrink-0" />
            Workflow
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md overflow-y-auto sm:max-h-[90vh]">
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
            className={cn(
              "h-7 w-full justify-start gap-1.5 px-2 text-xs",
              guideStyles.phases,
            )}
          >
            <BookOpenIcon className="size-3.5 shrink-0" />
            Phases
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl sm:max-h-[90vh]">
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
            className={cn(
              "h-7 w-full justify-start gap-1.5 px-2 text-xs",
              guideStyles.checklist,
            )}
          >
            <ListChecksIcon className="size-3.5 shrink-0" />
            Checklist
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Discovery & delivery checklist</DialogTitle>
          </DialogHeader>
          <ChecklistBody />
        </DialogContent>
      </Dialog>
    </div>
  );
}
