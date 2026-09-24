import Link from "next/link";
import { redirect } from "next/navigation";

import { getLastProjectId } from "@/lib/cookies";
import * as projectService from "@/lib/services/project.service";

export default async function ProjectsPage() {
  const projects = await projectService.listProjects();
  const lastProjectId = await getLastProjectId("");

  if (lastProjectId) {
    const match = projects.find((p) => p.id === lastProjectId);
    if (match?.todoLists[0]) {
      redirect(
        `/projects/${match.id}/lists/${match.todoLists[0].id}`,
      );
    }
    if (match) {
      redirect(`/projects/${match.id}`);
    }
  }

  if (projects.length === 1 && projects[0].todoLists[0]) {
    redirect(
      `/projects/${projects[0].id}/lists/${projects[0].todoLists[0].id}`,
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="max-w-sm text-center">
        <h1 className="text-sm font-semibold">Projects</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Use the sidebar to add a project (checklist is created automatically).
        </p>
        {projects.length > 0 && (
          <ul className="mt-4 divide-y rounded-md border text-left text-sm">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}`}
                  className="block px-3 py-2 hover:bg-muted/50"
                >
                  {project.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
