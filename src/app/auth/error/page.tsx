import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign-in error", robots: { index: false } };

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; detail?: string; oauth_code?: string }>;
}) {
  const { reason, detail, oauth_code: oauthCode } = await searchParams;
  const rateLimited = reason === "rate_limit";
  const missingCode = reason === "missing_code";
  const oauthFail = reason === "oauth";
  const exchangeFail = reason === "exchange";

  let message =
    "Something went wrong while signing in. Try again or contact us if it keeps happening.";
  if (rateLimited) {
    message = "Too many attempts from this network. Wait a few minutes and try again.";
  } else if (missingCode) {
    message =
      "The authorization code did not arrive. In Google Cloud, ensure the redirect URI matches Supabase (…/auth/v1/callback) and in Supabase allowlisted URLs include /auth/callback.";
  } else if (oauthFail || exchangeFail) {
    message =
      oauthFail
        ? "Google or Supabase rejected the sign-in request. Technical detail below (useful to fix configuration)."
        : "Could not create a session. Check that the Google provider is enabled in Supabase and Client ID/Secret match Google Cloud.";
  }

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground">Sign-in could not be completed</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{message}</p>
      {(detail || oauthCode) && (
        <pre className="mt-6 overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-left text-xs text-muted-foreground break-words whitespace-pre-wrap">
          {oauthCode ? `${oauthCode}\n` : ""}
          {detail ?? ""}
        </pre>
      )}
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">
        Back to home
      </Link>
    </main>
  );
}
