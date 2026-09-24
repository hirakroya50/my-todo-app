import { notFound } from "next/navigation";

import { ChecklistPageClient } from "@/components/checklist/checklist-page";
import { getListForUser, getProjectForUser } from "@/lib/permissions";
import * as addonService from "@/lib/services/project-addon.service";
import * as listService from "@/lib/services/todo-list.service";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ projectId: string; listId: string }>;
}) {
  const { projectId, listId } = await params;
  const list = await getListForUser("", listId);
  if (!list || list.projectId !== projectId) notFound();

  const project = await getProjectForUser("", projectId);
  if (!project) notFound();

  const tree = await listService.getFullTree("", listId);
  const addons = await addonService.listProjectAddons("", projectId);

  return (
    <ChecklistPageClient
      projectId={projectId}
      projectAddons={addons.map((a) => ({
        id: a.id,
        type: a.type,
        sortOrder: a.sortOrder,
        textContent: a.textContent,
        url: a.url,
        imageUrl: a.imageUrl,
      }))}
      tree={tree}
    />
  );
}
