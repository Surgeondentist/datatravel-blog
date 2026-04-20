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

  const code = searchParams.get("code");
  const next = safeInternalNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin).toString());
    }
    console.error("[auth/callback] exchangeCodeForSession:", error.message);
  }

  return NextResponse.redirect(new URL("/auth/error", origin).toString());
}
