"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_DISPLAY_NAME } from "@/lib/constants/app";

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
          if (reg.error === "VALIDATION" && "message" in reg) {
            toast.error(reg.message);
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
    <div className="w-full max-w-md rounded-2xl border border-primary/15 bg-card p-8 shadow-lg shadow-primary/5">
      <div className="mb-6 text-center lg:text-left">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-lg font-bold text-primary-foreground lg:mx-0">
          B
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {APP_DISPLAY_NAME}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to manage your projects
        </p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        <button
          type="button"
          className={`rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "signin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            className="h-10"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            className="h-10"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="button"
          className="h-10 w-full"
          disabled={pending}
          onClick={onCredentials}
        >
          {mode === "signup" ? "Create account" : "Continue"}
        </Button>
      </div>

      {(hasGoogle || hasGitHub) && (
        <div className="mt-6 space-y-3 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            Or continue with
          </p>
          <div className="grid gap-2">
            {hasGoogle && (
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() => signIn("google", { callbackUrl: "/projects" })}
              >
                Google
              </Button>
            )}
            {hasGitHub && (
              <Button
                type="button"
                variant="outline"
                className="h-10"
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
