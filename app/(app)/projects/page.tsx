import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { getLastProjectId } from "@/lib/cookies";
import * as projectService from "@/lib/services/project.service";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const projects = await projectService.listProjects(session.user.id);
  const lastProjectId = await getLastProjectId(session.user.id);

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
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Your projects</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Create a project from the sidebar, then add a todo list from the Software
        Development template.
      </p>
      {projects.length === 0 ? (
        <p className="text-sm">No projects yet — use the sidebar to add one.</p>
      ) : (
        <ul className="space-y-2 text-left">
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/projects/${project.id}`}>
                <Button variant="link" className="px-0">
                  {project.name}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
