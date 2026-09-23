import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppHeader } from "@/components/app-header";
import { SidebarNav } from "@/components/sidebar-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeftIcon } from "lucide-react";
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
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 flex-col border-r bg-card/30 md:flex">
          <div className="flex h-10 items-center border-b px-3">
            <span className="text-sm font-semibold tracking-tight">dev_todo</span>
          </div>
          <SidebarNav projects={sidebarProjects} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader userLabel={userLabel} showBrand={false} />
          <div className="flex items-center gap-2 border-b px-2 py-1 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="size-8">
                  <PanelLeftIcon className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-56 p-0">
                <div className="border-b px-3 py-2 text-sm font-semibold">dev_todo</div>
                <SidebarNav projects={sidebarProjects} />
              </SheetContent>
            </Sheet>
            <span className="truncate text-xs text-muted-foreground">{userLabel}</span>
          </div>
          <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
