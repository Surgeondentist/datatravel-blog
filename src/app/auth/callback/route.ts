import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientIp, getRequestOrigin, safeInternalNextPath } from "@/lib/client-ip";
import { rateLimitAuthCallback } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const origin = getRequestOrigin(request);
  const { searchParams } = new URL(request.url);

  const ip = getClientIp(request.headers);
  const authOk = await rateLimitAuthCallback(ip);
  if (!authOk) {
    return NextResponse.redirect(new URL("/auth/error?reason=rate_limit", origin).toString());
  }

  const oauthError = searchParams.get("error");
  const oauthDesc = searchParams.get("error_description");
  if (oauthError) {
    const u = new URL("/auth/error", origin);
    u.searchParams.set("reason", "oauth");
    u.searchParams.set("oauth_code", oauthError);
    if (oauthDesc) u.searchParams.set("detail", oauthDesc.slice(0, 400));
    return NextResponse.redirect(u.toString());
  }

  const code = searchParams.get("code");
  const next = safeInternalNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin).toString());
    }
    console.error("[auth/callback] exchangeCodeForSession:", error.message);
    const u = new URL("/auth/error", origin);
    u.searchParams.set("reason", "exchange");
    u.searchParams.set("detail", error.message.slice(0, 300));
    return NextResponse.redirect(u.toString());
  }

  return NextResponse.redirect(new URL("/auth/error?reason=missing_code", origin).toString());
}
