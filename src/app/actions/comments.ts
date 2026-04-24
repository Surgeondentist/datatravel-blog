"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { rateLimitReportComment, rateLimitSubmitComment } from "@/lib/rate-limit";

const BANNED_WORDS = ["spam", "casino", "viagra", "porno", "xxx"];

function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some((w) => lower.includes(w));
}

export async function submitComment(postSlug: string, body: string) {
  if (!body || body.trim().length < 2) return { error: "El comentario es demasiado corto." };
  if (body.trim().length > 1000) return { error: "Máximo 1000 caracteres." };
  if (containsBannedWords(body)) return { error: "Tu comentario contiene contenido no permitido." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión para comentar." };

  const allowed = await rateLimitSubmitComment(user.id);
  if (!allowed) return { error: "Demasiados comentarios en poco tiempo. Espera unos minutos." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role === "banned") return { error: "Tu cuenta no puede publicar comentarios." };

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    post_slug: postSlug,
    body: body.trim(),
    status: "pending",
  });

  if (error) return { error: "Error al enviar el comentario." };
  revalidatePath(`/blog/${postSlug}`);
  return { success: true };
}

export async function reportComment(commentId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión." };

  const allowed = await rateLimitReportComment(user.id);
  if (!allowed) return { error: "Demasiados reportes en poco tiempo. Prueba más tarde." };

  const { error } = await supabase.from("reports").insert({
    comment_id: commentId,
    reported_by: user.id,
    reason: reason.trim(),
  });

  if (error?.code === "23505") return { error: "Ya reportaste este comentario." };
  if (error) return { error: "Error al reportar." };
  return { success: true };
}

export async function moderateComment(commentId: string, status: "published" | "rejected") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { error: "No autorizado." };

  const { error } = await supabase.from("comments").update({ status }).eq("id", commentId);
  if (error) return { error: "Error al moderar." };
  revalidatePath("/admin/comentarios");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { error: "No autorizado." };

  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { error: "Error al eliminar." };
  revalidatePath("/admin/comentarios");
  return { success: true };
}
