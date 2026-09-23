"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ hasGoogle, hasGitHub }: { hasGoogle: boolean; hasGitHub: boolean }) {
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
        toast.error(reg.error === "EMAIL_EXISTS" ? "Email already registered" : "Sign up failed");
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
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 p-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">dev_todo</h1>
        <p className="text-sm text-muted-foreground">
          Dev checklist for your projects
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "signin" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setMode("signin")}
        >
          Sign in
        </Button>
        <Button
          type="button"
          variant={mode === "signup" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setMode("signup")}
        >
          Sign up
        </Button>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
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
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="button"
          className="w-full"
          disabled={pending}
          onClick={onCredentials}
        >
          {mode === "signup" ? "Create account" : "Sign in with email"}
        </Button>
      </div>

      {(hasGoogle || hasGitHub) && (
        <div className="space-y-2">
          <div className="text-center text-xs text-muted-foreground">Or continue with</div>
          <div className="flex flex-col gap-2">
            {hasGoogle && (
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn("google", { callbackUrl: "/projects" })}
              >
                Google
              </Button>
            )}
            {hasGitHub && (
              <Button
                type="button"
                variant="outline"
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
