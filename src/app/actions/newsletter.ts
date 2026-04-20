"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getClientIp } from "@/lib/client-ip";
import { rateLimitNewsletter } from "@/lib/rate-limit";

export async function subscribeNewsletter(email: string): Promise<{ error?: string; success?: boolean }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Ingresa un correo válido." };
  }

  const h = await headers();
  const ip = getClientIp(h);
  const allowed = await rateLimitNewsletter(ip);
  if (!allowed) {
    return { error: "Demasiados intentos desde esta red. Prueba más tarde." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({ email: email.toLowerCase().trim(), confirmed: true });

  if (error) {
    if (error.code === "23505") return { error: "Este correo ya está suscrito." };
    return { error: "Algo salió mal. Intenta de nuevo." };
  }

  return { success: true };
}
