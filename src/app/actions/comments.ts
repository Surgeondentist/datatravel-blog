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
  if (!body || body.trim().length < 2) return { error: "Comment is too short." };
  if (body.trim().length > 1000) return { error: "Maximum 1000 characters." };
  if (containsBannedWords(body)) return { error: "Your comment contains disallowed content." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to comment." };

  const allowed = await rateLimitSubmitComment(user.id);
  if (!allowed) return { error: "Too many comments in a short time. Please wait a few minutes." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role === "banned") return { error: "Your account cannot post comments." };

  const { error } = await supabase.from("comments").insert({
    user_id: user.id,
    post_slug: postSlug,
    body: body.trim(),
    status: "pending",
  });

  if (error) return { error: "Could not submit your comment." };
  revalidatePath(`/blog/${postSlug}`);
  return { success: true };
}

export async function reportComment(commentId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const allowed = await rateLimitReportComment(user.id);
  if (!allowed) return { error: "Too many reports in a short time. Try again later." };

  const { error } = await supabase.from("reports").insert({
    comment_id: commentId,
    reported_by: user.id,
    reason: reason.trim(),
  });

  if (error?.code === "23505") return { error: "You have already reported this comment." };
  if (error) return { error: "Could not submit report." };
  return { success: true };
}

export async function moderateComment(commentId: string, status: "published" | "rejected") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { error: "Unauthorized." };

  const { error } = await supabase.from("comments").update({ status }).eq("id", commentId);
  if (error) return { error: "Could not update comment." };
  revalidatePath("/admin/comentarios");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { error: "Unauthorized." };

  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { error: "Could not delete comment." };
  revalidatePath("/admin/comentarios");
  return { success: true };
}
