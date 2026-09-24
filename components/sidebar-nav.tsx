"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createProjectAction } from "@/app/actions/projects";
import { ReferenceDialogs } from "@/components/sidebar/reference-dialogs";
import { SidebarFooter } from "@/components/sidebar/sidebar-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SidebarProject = {
  id: string;
  name: string;
  listId: string | null;
};

export function SidebarNav({
  projects,
  userLabel,
}: {
  projects: SidebarProject[];
  userLabel: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [newProjectName, setNewProjectName] = useState("");

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
      if (result.list) {
        router.push(`/projects/${result.project.id}/lists/${result.list.id}`);
      }
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-1.5">
        <div className="flex gap-1">
          <Input
            className="h-7 text-xs"
            placeholder="New project"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onCreateProject()}
          />
          <Button
            type="button"
            size="icon"
            className="size-7 shrink-0"
            disabled={pending}
            onClick={onCreateProject}
            aria-label="Add project"
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </div>
        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
          {projects.map((project) => {
            const href = project.listId
              ? `/projects/${project.id}/lists/${project.listId}`
              : `/projects/${project.id}`;
            const active =
              pathname === href || pathname.startsWith(`/projects/${project.id}/`);
            return (
              <Link
                key={project.id}
                href={href}
                className={cn(
                  "block truncate rounded px-2 py-1 text-xs font-medium hover:bg-accent",
                  active && "bg-accent text-accent-foreground",
                )}
              >
                {project.name}
              </Link>
            );
          })}
        </nav>
        <ReferenceDialogs />
      </div>
      <SidebarFooter userLabel={userLabel} />
    </div>
  );
}
