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
      toast.success("List created from template");
    });
  };

  return (
    <div className="flex h-full flex-col gap-4 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Projects
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="New project"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <Button
          type="button"
          size="icon"
          disabled={pending}
          onClick={onCreateProject}
          aria-label="Add project"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {projects.map((project) => (
          <div key={project.id} className="space-y-1">
            <Link
              href={`/projects/${project.id}`}
              onClick={() => setActiveProjectId(project.id)}
              className={cn(
                "block rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent",
                pathname.includes(`/projects/${project.id}`) && "bg-accent",
              )}
            >
              {project.name}
            </Link>
            <ul className="space-y-0.5 pl-3">
              {project.todoLists.map((list) => {
                const href = `/projects/${project.id}/lists/${list.id}`;
                return (
                  <li key={list.id}>
                    <Link
                      href={href}
                      className={cn(
                        "block rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                        pathname === href && "bg-accent text-foreground",
                      )}
                    >
                      · {list.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t pt-3">
        <div className="text-xs text-muted-foreground">New list (template)</div>
        <Input
          placeholder="List title"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
        />
        <Button
          type="button"
          className="w-full"
          size="sm"
          disabled={pending || !activeProjectId}
          onClick={onCreateList}
        >
          + List from template
        </Button>
      </div>
    </div>
  );
}
