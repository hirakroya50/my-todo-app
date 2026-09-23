"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  hasGoogle,
  hasGitHub,
}: {
  hasGoogle: boolean;
  hasGitHub: boolean;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransition] = useTransition();

  const onCredentials = () => {
    startTransition(async () => {
      if (mode === "signup") {
        const reg = await registerUser({ email, password });
        if ("error" in reg) {
          if (reg.error === "DATABASE_SCHEMA") {
            toast.error("Database needs migration. Run: npx prisma migrate deploy");
            return;
          }
          toast.error(
            reg.error === "EMAIL_EXISTS" ? "Email already registered" : "Sign up failed",
          );
          return;
        }
      }
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/projects",
      });
    });
  };

  return (
    <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-5 text-center">
        <h1 className="text-lg font-semibold tracking-tight">dev_todo</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Dev project checklists
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
        <button
          type="button"
          className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
            mode === "signin"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`rounded-md py-1.5 text-xs font-medium transition-colors ${
            mode === "signup"
              ? "bg-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">Email</Label>
          <Input
            id="email"
            className="h-9"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs">Password</Label>
          <Input
            id="password"
            className="h-9"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="button"
          className="h-9 w-full"
          disabled={pending}
          onClick={onCredentials}
        >
          {mode === "signup" ? "Create account" : "Continue"}
        </Button>
      </div>

      {(hasGoogle || hasGitHub) && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <p className="text-center text-[10px] uppercase tracking-wide text-muted-foreground">
            OAuth
          </p>
          <div className="grid gap-2">
            {hasGoogle && (
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => signIn("google", { callbackUrl: "/projects" })}
              >
                Google
              </Button>
            )}
            {hasGitHub && (
              <Button
                type="button"
                variant="outline"
                className="h-9"
                onClick={() => signIn("github", { callbackUrl: "/projects" })}
              >
                GitHub
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
