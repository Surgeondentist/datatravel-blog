import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isAppLocale, LOCALE_COOKIE, resolveInitialLocale } from "@/lib/locale-shared";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const raw = request.cookies.get(LOCALE_COOKIE)?.value;
  if (!isAppLocale(raw)) {
    const locale = resolveInitialLocale(request);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
