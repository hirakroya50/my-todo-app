"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createListAction } from "@/app/actions/lists";
import { createProjectAction } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SidebarProject = {
  id: string;
  name: string;
  todoLists: { id: string; title: string }[];
};

export function SidebarNav({ projects }: { projects: SidebarProject[] }) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [newProjectName, setNewProjectName] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [activeProjectId, setActiveProjectId] = useState(
    projects[0]?.id ?? "",
  );

  const onCreateProject = () => {
    if (!newProjectName.trim()) return;
    startTransition(async () => {
      const result = await createProjectAction({ name: newProjectName.trim() });
      if ("error" in result) {
        toast.error("Could not create project");
        return;
      }
      setNewProjectName("");
      toast.success("Project created");
    });
  };

  const onCreateList = () => {
    if (!activeProjectId || !newListTitle.trim()) return;
    startTransition(async () => {
      const result = await createListAction(activeProjectId, {
        title: newListTitle.trim(),
        mode: "template",
      });
      if ("error" in result) {
        toast.error("Could not create list");
        return;
      }
      setNewListTitle("");
      toast.success("List created");
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 p-2 text-sm">
      <div className="flex gap-1">
        <Input
          className="h-8 text-xs"
          placeholder="New project"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCreateProject()}
        />
        <Button
          type="button"
          size="icon"
          className="size-8 shrink-0"
          disabled={pending}
          onClick={onCreateProject}
          aria-label="Add project"
        >
          <PlusIcon className="size-3.5" />
        </Button>
      </div>
      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
        {projects.map((project) => (
          <div key={project.id}>
            <Link
              href={`/projects/${project.id}`}
              onClick={() => setActiveProjectId(project.id)}
              className={cn(
                "block truncate rounded px-2 py-1 text-xs font-medium hover:bg-accent",
                pathname.includes(`/projects/${project.id}`) &&
                  "bg-accent text-accent-foreground",
              )}
            >
              {project.name}
            </Link>
            <ul className="mt-0.5 space-y-px border-l border-border/80 pl-2 ml-2">
              {project.todoLists.map((list) => {
                const href = `/projects/${project.id}/lists/${list.id}`;
                const active = pathname === href;
                return (
                  <li key={list.id}>
                    <Link
                      href={href}
                      className={cn(
                        "block truncate rounded px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground",
                        active && "bg-primary/10 font-medium text-foreground",
                      )}
                    >
                      {list.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="shrink-0 space-y-1 border-t pt-2">
        <Input
          className="h-8 text-xs"
          placeholder="New list title"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCreateList()}
        />
        <Button
          type="button"
          className="h-8 w-full text-xs"
          variant="secondary"
          disabled={pending || !activeProjectId}
          onClick={onCreateList}
        >
          + Template list
        </Button>
      </div>
    </div>
  );
}
