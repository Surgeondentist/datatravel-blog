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
  const excerptLine = excerpt ? `Resumen: ${excerpt}\n` : "";
  const content = `Título: ${title}\n${excerptLine}\n${body}`;

  if (formato === "twitter") {
    return `Eres un experto en comunicación digital. Convierte este artículo de blog en un hilo de Twitter/X.

Reglas:
- Entre 6 y 10 tuits
- Cada tuit máximo 280 caracteres
- Primer tuit: gancho que genere curiosidad
- Último tuit: invita a leer el artículo completo en Redshell
- Numeración: "1/" al inicio de cada tuit
- 1-2 emojis por tuit, relevantes al contenido
- Separa cada tuit con una línea en blanco

${content}`;
  }

  if (formato === "newsletter") {
    return `Eres un experto en email marketing. Redacta un email de newsletter en español para promocionar este artículo del blog Redshell.

Formato:
**Asunto:** (máx. 60 caracteres)
**Preheader:** (máx. 100 caracteres)

[Cuerpo del email: saludo, 3-4 párrafos conversacionales, llamada a la acción clara]

[Firma: El equipo de Redshell]

${content}`;
  }

  // reels
  return `Eres un experto en contenido para redes sociales. Crea un guion para un Reel de Instagram o YouTube Short en español.

Formato:
**Duración:** 60-90 segundos

**HOOK (0-3s):** [frase que detiene el scroll]
**PUNTO 1 (4-20s):** [primer concepto clave]
**PUNTO 2 (21-40s):** [segundo concepto clave]
**PUNTO 3 (41-55s):** [tercer concepto o conclusión práctica]
**CTA (56-90s):** [llamada a la acción]

**Descripción del video:**
[2-3 líneas + 6-8 hashtags en español]

${content}`;
}

export async function generarContenido(
  slug: string,
  formato: Formato
): Promise<{ contenido: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return { error: "No autorizado" };

  const post = await sanityClient.fetch(postBySlugQuery, { slug });
  if (!post) return { error: "Artículo no encontrado" };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { error: "ANTHROPIC_API_KEY no configurada en el servidor" };

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

  return { contenido: text };
}
