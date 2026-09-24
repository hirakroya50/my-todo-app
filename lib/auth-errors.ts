/** User-facing copy for Auth.js `?error=` query values on the sign-in page. */
export function authErrorMessage(code: string | undefined | null): string | null {
  if (!code) return null;

  const messages: Record<string, string> = {
    OAuthAccountNotLinked:
      "This email already has an account. Sign in with your email and password instead of Google or GitHub.",
    OAuthSignin: "Could not start sign-in. Please try again.",
    OAuthCallback: "Sign-in was interrupted. Please try again.",
    OAuthCreateAccount: "Could not create your account. Please try again.",
    EmailCreateAccount: "Could not create your account. Please try again.",
    CallbackRouteError: "Sign-in failed. Please try again.",
    AccessDenied: "Access was denied. You may not have permission to sign in.",
    Configuration: "Sign-in is not configured correctly. Contact support.",
    Verification: "The sign-in link expired or was already used.",
    CredentialsSignin: "Invalid email or password.",
    SessionRequired: "Please sign in to continue.",
  };

  return messages[code] ?? "Sign-in failed. Please try again.";
}
