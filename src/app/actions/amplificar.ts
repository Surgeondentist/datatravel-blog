"use server";
import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { client as sanityClient } from "@/sanity/lib/client";
import { postBySlugQuery } from "@/sanity/lib/queries";
import { createClient } from "@/lib/supabase/server";

export type Formato = "twitter" | "newsletter" | "reels";

type PtBlock = {
  _type: string;
  children?: { text?: string }[];
};

function ptToText(blocks: unknown[]): string {
  if (!Array.isArray(blocks)) return "";
  return (blocks as PtBlock[])
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .filter(Boolean)
    .join("\n\n");
}

function buildPrompt(formato: Formato, title: string, excerpt: string, body: string): string {
  const excerptLine = excerpt ? `Summary: ${excerpt}\n` : "";
  const content = `Title: ${title}\n${excerptLine}\n${body}`;

  if (formato === "twitter") {
    return `You are a digital communications expert. Turn this blog post into a Twitter/X thread.

Rules:
- Between 6 and 10 tweets
- Each tweet max 280 characters
- First tweet: curiosity hook
- Last tweet: invite readers to the full article on Redshell
- Number each tweet with "1/" at the start
- 1-2 relevant emojis per tweet
- Separate tweets with a blank line

${content}`;
  }

  if (formato === "newsletter") {
    return `You are an email marketing expert. Write a newsletter email in English to promote this Redshell blog post.

Format:
**Subject:** (max 60 characters)
**Preheader:** (max 100 characters)

[Email body: greeting, 3-4 conversational paragraphs, clear call to action]

[Sign-off: The Redshell team]

${content}`;
  }

  // reels
  return `You are a social content expert. Create a script for an Instagram Reel or YouTube Short in English.

Format:
**Length:** 60-90 seconds

**HOOK (0-3s):** [scroll-stopping line]
**BEAT 1 (4-20s):** [first key idea]
**BEAT 2 (21-40s):** [second key idea]
**BEAT 3 (41-55s):** [third idea or practical takeaway]
**CTA (56-90s):** [call to action]

**Video description:**
[2-3 lines + 6-8 hashtags in English]

${content}`;
}

export async function generarContenido(
  slug: string,
  formato: Formato
): Promise<{ content: string } | { error: string }> {
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

  const post = await sanityClient.fetch(postBySlugQuery, { slug });
  if (!post) return { error: "Post not found" };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { error: "ANTHROPIC_API_KEY is not set on the server" };

  const body = ptToText(post.body ?? []);
  const prompt = buildPrompt(formato, post.title ?? "", post.excerpt ?? "", body);

  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    message.content.find((b): b is Anthropic.TextBlock => b.type === "text")
      ?.text ?? "";

  return { content: text };
}
