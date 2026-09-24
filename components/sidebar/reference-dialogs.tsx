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

const guideDialogContentClass =
  "flex max-h-[min(90vh,36rem)] w-[min(96vw,56rem)] flex-col gap-0 overflow-hidden p-4 sm:max-h-[min(92vh,40rem)] sm:p-5";

const guideScrollBodyClass =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]";

function WorkflowBody() {
  const last = WORKFLOW_LADDER_STEPS.length - 1;
  return (
    <ol className="flex w-full flex-col text-xs leading-snug">
      {WORKFLOW_LADDER_STEPS.map((step, i) => (
        <li key={step} className="flex w-full min-h-0 flex-row gap-2">
          <div
            className="flex w-5 shrink-0 flex-col items-center"
            aria-hidden
          >
            <span
              className="flex size-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground"
            >
              {i + 1}
            </span>
            {i < last && (
              <div className="flex flex-1 flex-col items-center py-0.5">
                <div className="w-px min-h-2 flex-1 bg-primary/35" />
                <ArrowDownIcon className="size-3 shrink-0 text-primary/55" />
                <div className="w-px min-h-2 flex-1 bg-primary/35" />
              </div>
            )}
          </div>
          <span
            className={cn(
              "min-w-0 flex-1 text-foreground",
              i < last ? "pb-1" : "pb-0",
            )}
          >
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

function PhasesBody() {
  return (
    <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
      {PHASES_SUMMARY.map((phase) => (
        <div
          key={phase.title}
          className="rounded-md border border-border/50 bg-muted/20 px-2 py-1.5"
        >
          <h4 className="text-xs font-semibold text-primary">{phase.title}</h4>
          <ul className="mt-1 list-disc space-y-0.5 pl-3.5 text-muted-foreground">
            {phase.items.map((item) => (
              <li key={item} className="leading-snug">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ChecklistBody() {
  return (
    <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
      {DISCOVERY_CHECKLIST.map((section) => (
        <div
          key={section.title}
          className="rounded-md border border-border/50 bg-muted/20 px-2 py-1.5"
        >
          <h4 className="text-xs font-semibold text-foreground">
            {section.title}
          </h4>
          <ul className="mt-1 space-y-0.5">
            {section.items.map((item) => (
              <li
                key={item}
                className="flex gap-1.5 leading-snug text-muted-foreground"
              >
                <span className="shrink-0 text-primary">☐</span>
                <span className="min-w-0 break-words">{item}</span>
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
        <DialogContent className={cn(guideDialogContentClass, "max-w-md")}>
          <DialogHeader className="shrink-0 space-y-1 pb-2">
            <DialogTitle className="text-base">Development workflow</DialogTitle>
          </DialogHeader>
          <div className={guideScrollBodyClass}>
            <WorkflowBody />
          </div>
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
        <DialogContent className={guideDialogContentClass}>
          <DialogHeader className="shrink-0 space-y-1 pb-2">
            <DialogTitle className="text-base">Phase summary</DialogTitle>
          </DialogHeader>
          <div className={guideScrollBodyClass}>
            <PhasesBody />
          </div>
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
        <DialogContent className={guideDialogContentClass}>
          <DialogHeader className="shrink-0 space-y-1 pb-2">
            <DialogTitle className="text-base">
              Discovery & delivery checklist
            </DialogTitle>
          </DialogHeader>
          <div className={guideScrollBodyClass}>
            <ChecklistBody />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
