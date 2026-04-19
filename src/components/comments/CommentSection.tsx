"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { submitComment, reportComment } from "@/app/actions/comments";
import { Flag, LogIn, Send, MessageCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string; avatar_url: string | null };
};

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetchComments();
  }, []);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("id, body, created_at, profiles(display_name, avatar_url)")
      .eq("post_slug", postSlug)
      .eq("status", "published")
      .order("created_at", { ascending: false });
    if (data) setComments(data as unknown as Comment[]);
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=/blog/${postSlug}` },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitComment(postSlug, body);
      if (result.error) {
        setMessage({ text: result.error, ok: false });
      } else {
        setBody("");
        setMessage({ text: "Comentario enviado. Será publicado tras revisión.", ok: true });
        setTimeout(() => setMessage(null), 5000);
      }
    });
  }

  async function handleReport(commentId: string) {
    const reason = prompt("¿Por qué reportas este comentario?");
    if (!reason) return;
    const result = await reportComment(commentId, reason);
    alert(result.error ?? "Comentario reportado. Lo revisaremos pronto.");
  }

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });

  return (
    <section className="mt-12 border-t border-border pt-10">
      <h2 className="mb-6 flex items-center gap-2 font-heading text-xl font-semibold text-foreground">
        <MessageCircle className="h-5 w-5 text-primary" />
        Comentarios {comments.length > 0 && <span className="text-sm font-normal text-muted-foreground">({comments.length})</span>}
      </h2>

      {/* Form */}
      {user ? (
        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Comentando como <span className="font-medium text-foreground">{user.user_metadata?.full_name ?? user.email}</span>
            </span>
            <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Cerrar sesión
            </button>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Escribe tu comentario... (máx. 1000 caracteres)"
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{body.length}/1000</span>
            <button
              onClick={handleSubmit}
              disabled={isPending || body.trim().length < 2}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              {isPending ? "Enviando..." : "Comentar"}
            </button>
          </div>
          {message && (
            <p className={`mt-2 text-sm ${message.ok ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
              {message.text}
            </p>
          )}
        </div>
      ) : (
        <div className="mb-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/30 py-8 text-center">
          <p className="text-sm text-muted-foreground">Inicia sesión para dejar un comentario</p>
          <button
            onClick={handleLogin}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            Entrar con Google
          </button>
        </div>
      )}

      {/* Normas */}
      <p className="mb-6 text-xs text-muted-foreground">
        Al comentar aceptas nuestras normas: respeto, sin spam, sin lenguaje ofensivo ni contenido explícito.
      </p>

      {/* Lista de comentarios */}
      {comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Sé el primero en comentar.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="group rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {c.profiles?.avatar_url ? (
                    <img src={c.profiles.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {c.profiles?.display_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground">{c.profiles?.display_name ?? "Usuario"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{date(c.created_at)}</span>
                  {user && (
                    <button
                      onClick={() => handleReport(c.id)}
                      className="hidden cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive group-hover:flex"
                    >
                      <Flag className="h-3 w-3" /> Reportar
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
