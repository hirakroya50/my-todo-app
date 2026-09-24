import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { APP_DISPLAY_NAME, APP_TAGLINE } from "@/lib/constants/app";
import { githubOAuthEnv, googleOAuthEnv } from "@/lib/oauth-env";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/projects");
  const hasGoogle = Boolean(googleOAuthEnv());
  const hasGitHub = Boolean(githubOAuthEnv());

  return (
    <main className="flex min-h-dvh">
      <section
        className="hidden flex-1 flex-col justify-between bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 p-10 text-primary-foreground lg:flex"
      >
        <div>
          <p className="text-2xl font-bold tracking-tight">{APP_DISPLAY_NAME}</p>
          <p className="mt-2 max-w-md text-sm text-primary-foreground/85">
            {APP_TAGLINE}
          </p>
        </div>
        <ul className="space-y-2 text-sm text-primary-foreground/90">
          <li>Structured dev checklists for every project</li>
          <li>Notes with links and screenshots in one place</li>
          <li>Workflow guides built into the sidebar</li>
        </ul>
      </section>
      <section className="flex flex-1 items-center justify-center bg-background px-4 py-10">
        <LoginForm hasGoogle={hasGoogle} hasGitHub={hasGitHub} />
      </section>
    </main>
  );
}
