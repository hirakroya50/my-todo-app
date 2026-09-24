/** OAuth client credentials (supports Auth.js `AUTH_*` and legacy `*_CLIENT_*` names). */
export function googleOAuthEnv(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID;
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

export function githubOAuthEnv(): { clientId: string; clientSecret: string } | null {
  const clientId = process.env.GITHUB_CLIENT_ID ?? process.env.AUTH_GITHUB_ID;
  const clientSecret =
    process.env.GITHUB_CLIENT_SECRET ?? process.env.AUTH_GITHUB_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}
