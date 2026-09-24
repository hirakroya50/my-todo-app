import { notFound, redirect } from "next/navigation";

import { getProjectForUser } from "@/lib/permissions";
import * as projectService from "@/lib/services/project.service";

export default async function ProjectHubPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectForUser("", projectId);
  if (!project) notFound();

  const list = await projectService.ensureProjectChecklist("", projectId);
  redirect(`/projects/${projectId}/lists/${list.id}`);
}
