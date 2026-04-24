/**
 * URL canónica del sitio (sin barra final).
 *
 * Configura en `.env.local` / variables de Vercel (producción en apex):
 * `NEXT_PUBLIC_SITE_URL=https://redshell.cloud`
 *
 * Si no está definida, en Vercel se usa `VERCEL_URL`. Último recurso: el despliegue por defecto.
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
