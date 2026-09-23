"use client";

import { signOut } from "next-auth/react";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function AppHeader({
  userLabel,
  showBrand = true,
}: {
  userLabel: string;
  showBrand?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b bg-background px-3">
      {showBrand ? (
        <div className="text-sm font-semibold tracking-tight">dev_todo</div>
      ) : (
        <div className="hidden text-xs text-muted-foreground md:block truncate max-w-[40%]">
          {userLabel}
        </div>
      )}
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <SunIcon className="size-3.5 dark:hidden" />
          <MoonIcon className="hidden size-3.5 dark:block" />
        </Button>
        <span className="hidden max-w-[12rem] truncate text-xs text-muted-foreground lg:inline">
          {userLabel}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Log out"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOutIcon className="size-3.5" />
        </Button>
      </div>
    </header>
  );
}
