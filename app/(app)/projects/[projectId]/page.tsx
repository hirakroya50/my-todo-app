import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProjectForUser } from "@/lib/permissions";
import * as projectService from "@/lib/services/project.service";

export default async function ProjectHubPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { projectId } = await params;
  const project = await getProjectForUser(session.user.id, projectId);
  if (!project) notFound();

  const list = await projectService.ensureProjectChecklist(
    session.user.id,
    projectId,
  );
  redirect(`/projects/${projectId}/lists/${list.id}`);
}
