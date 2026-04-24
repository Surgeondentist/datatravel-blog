"use server";
import "server-only";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

export async function enviarNewsletter(
  subject: string,
  htmlContent: string
): Promise<{ sent: number } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { error: "RESEND_API_KEY is not set on the server" };

  const from = process.env.RESEND_FROM ?? "Redshell <newsletter@redshell.cloud>";

  const { data: subscribers, error: dbError } = await supabase
    .from("subscribers")
    .select("email")
    .eq("confirmed", true);

  if (dbError) return { error: dbError.message };
  if (!subscribers || subscribers.length === 0) return { error: "No confirmed subscribers" };

  const resend = new Resend(apiKey);

  const emails = subscribers.map((s) => ({
    from,
    to: s.email as string,
    subject,
    html: htmlContent,
  }));

  // Resend batch limit is 100 per call
  const chunks: typeof emails[] = [];
  for (let i = 0; i < emails.length; i += 100) {
    chunks.push(emails.slice(i, i + 100));
  }

  let sent = 0;
  for (const chunk of chunks) {
    const { error } = await resend.batch.send(chunk);
    if (error) return { error: error.message };
    sent += chunk.length;
  }

  return { sent };
}
