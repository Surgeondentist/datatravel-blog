import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { LOCALE_COOKIE, normalizeLocale, type AppLocale } from "@/lib/locale-shared";

export const getLocale = cache(async (): Promise<AppLocale> => {
  const jar = await cookies();
  return normalizeLocale(jar.get(LOCALE_COOKIE)?.value);
});
