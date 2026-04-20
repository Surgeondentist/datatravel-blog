/**
 * Solo URLs https a orígenes típicos de avatares OAuth (Google, GitHub) o almacenamiento Supabase.
 * Evita javascript:, data: y hosts arbitrarios en <img src>.
 */
const ALLOWED_HOST_SUFFIXES = [".googleusercontent.com", ".google.com"];
const ALLOWED_EXACT_HOSTS = new Set([
  "avatars.githubusercontent.com",
  "secure.gravatar.com",
  "www.gravatar.com",
]);

function isAllowedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (ALLOWED_EXACT_HOSTS.has(h)) return true;
  return ALLOWED_HOST_SUFFIXES.some((suffix) => h === suffix.slice(1) || h.endsWith(suffix));
}

/** Hostname de proyecto Supabase Storage: xxx.supabase.co */
function isSupabaseStorageHost(hostname: string): boolean {
  return hostname.toLowerCase().endsWith(".supabase.co");
}

export function safeAvatarUrl(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;

  const host = url.hostname;
  if (isAllowedHost(host) || isSupabaseStorageHost(host)) {
    return url.toString();
  }

  return null;
}
