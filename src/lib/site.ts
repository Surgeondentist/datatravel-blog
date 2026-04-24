/**
 * Canonical site URL (no trailing slash).
 *
 * Set in `.env.local` / Vercel env (production apex):
 * `NEXT_PUBLIC_SITE_URL=https://redshell.cloud`
 *
 * If unset, Vercel uses `VERCEL_URL`. Fallback: localhost.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}
