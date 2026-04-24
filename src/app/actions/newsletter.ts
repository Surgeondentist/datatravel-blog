"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getClientIp } from "@/lib/client-ip";
import { rateLimitNewsletter } from "@/lib/rate-limit";

export async function subscribeNewsletter(email: string): Promise<{ error?: string; success?: boolean }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  const h = await headers();
  const ip = getClientIp(h);
  const allowed = await rateLimitNewsletter(ip);
  if (!allowed) {
    return { error: "Too many attempts from this network. Try again later." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({ email: email.toLowerCase().trim(), confirmed: true });

  if (error) {
    if (error.code === "23505") return { error: "This email is already subscribed." };
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
