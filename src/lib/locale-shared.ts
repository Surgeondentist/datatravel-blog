import type { NextRequest } from "next/server";

export const LOCALE_COOKIE = "rs-locale";

export type AppLocale = "en" | "es";

export function isAppLocale(value: string | undefined): value is AppLocale {
  return value === "en" || value === "es";
}

export function normalizeLocale(value: string | undefined): AppLocale {
  return isAppLocale(value) ? value : "en";
}

/** Prioridad: idioma del navegador; si no hay preferencia clara, país hispanohablante (p. ej. cabecera Vercel). */
export function resolveInitialLocale(request: NextRequest): AppLocale {
  const accept = request.headers.get("accept-language") ?? "";
  const first = accept.split(",")[0]?.trim().split(";")[0]?.toLowerCase() ?? "";
  if (first.startsWith("es")) return "es";
  if (first.startsWith("en")) return "en";

  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && SPANISH_SPEAKING.has(country)) return "es";

  return "en";
}

const SPANISH_SPEAKING = new Set([
  "ES",
  "MX",
  "AR",
  "CO",
  "PE",
  "VE",
  "CL",
  "EC",
  "GT",
  "CU",
  "BO",
  "DO",
  "HN",
  "PY",
  "SV",
  "NI",
  "CR",
  "PA",
  "UY",
  "PR",
  "GQ",
]);
