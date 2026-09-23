import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { getProjectForUser } from "@/lib/permissions";
import { db } from "@/lib/db";

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

  const lists = await db.todoList.findMany({
    where: { projectId },
    orderBy: { sortOrder: "asc" },
  });

  if (lists.length === 1) {
    redirect(`/projects/${projectId}/lists/${lists[0].id}`);
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-sm font-semibold">{project.name}</h1>
      <p className="mt-1 text-xs text-muted-foreground">Select a list</p>
      <ul className="mt-3 divide-y rounded-md border text-sm">
        {lists.map((list) => (
          <li key={list.id}>
            <Link
              href={`/projects/${projectId}/lists/${list.id}`}
              className="block px-3 py-2 hover:bg-muted/50"
            >
              {list.title}
            </Link>
          </li>
        ))}
      </ul>
      {lists.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          No lists yet — create one from the sidebar.
        </p>
      )}
    </div>
  );
}
