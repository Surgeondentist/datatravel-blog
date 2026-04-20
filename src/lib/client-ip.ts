/** IP del cliente a partir de cabeceras de proxy (Vercel, etc.). */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/** Origen público (https) correcto detrás de proxy en Vercel. */
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const proto = forwardedProto ?? "https";
    return `${proto}://${forwardedHost}`;
  }
  return new URL(request.url).origin;
}

/** Solo rutas internas relativas; evita open redirect con // o URLs absolutas. */
export function safeInternalNextPath(raw: string | null): string {
  if (raw == null || raw === "") return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/";
  return raw;
}
