import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppHeader } from "@/components/app-header";
import { SidebarNav } from "@/components/sidebar-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import * as projectService from "@/lib/services/project.service";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await projectService.listProjects(session.user.id);
  const sidebarProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    todoLists: p.todoLists.map((l) => ({ id: l.id, title: l.title })),
  }));

  const userLabel = session.user.email ?? session.user.name ?? "Account";

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <AppHeader userLabel={userLabel} />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-72 shrink-0 border-r md:block">
          <SidebarNav projects={sidebarProjects} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b p-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <MenuIcon className="size-4" />
                  Menu
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SidebarNav projects={sidebarProjects} />
              </SheetContent>
            </Sheet>
          </div>
          <main className="min-h-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
