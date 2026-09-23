import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/projects");
  const hasGoogle = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const hasGitHub = Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
  );

  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted/30 px-4">
      <LoginForm hasGoogle={hasGoogle} hasGitHub={hasGitHub} />
    </main>
  );
}
