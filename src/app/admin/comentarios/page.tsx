import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { moderateComment, deleteComment } from "@/app/actions/comments";
import { CheckCircle, XCircle, Trash2, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Comentarios" };

type Comment = {
  id: string;
  body: string;
  status: string;
  post_slug: string;
  created_at: string;
  profiles: { display_name: string; email: string };
};

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { data: comments } = await supabase
    .from("comments")
    .select("id, body, status, post_slug, created_at, profiles(display_name, email)")
    .order("created_at", { ascending: false }) as { data: Comment[] | null };

  const pending = comments?.filter((c) => c.status === "pending") ?? [];
  const published = comments?.filter((c) => c.status === "published") ?? [];
  const rejected = comments?.filter((c) => c.status === "rejected") ?? [];

  const date = (iso: string) => new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

  const statusBadge: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Moderación de comentarios</h1>
      <p className="mb-8 text-muted-foreground">
        <span className="font-medium text-amber-600">{pending.length} pendientes</span> ·{" "}
        {published.length} publicados · {rejected.length} rechazados
      </p>

      {pending.length === 0 && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          <Clock className="mx-auto mb-2 h-8 w-8 opacity-40" />
          No hay comentarios pendientes.
        </div>
      )}

      <div className="space-y-4">
        {comments?.map((c) => (
          <div key={c.id} className={`rounded-2xl border bg-card p-5 ${c.status === "pending" ? "border-amber-200 dark:border-amber-800" : "border-border"}`}>
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-medium text-foreground">{c.profiles?.display_name ?? "—"}</span>
                <span className="ml-2 text-xs text-muted-foreground">{c.profiles?.email}</span>
                <span className="ml-2 text-xs text-muted-foreground">· {date(c.created_at)}</span>
                <span className="ml-2 text-xs text-muted-foreground">· <a href={`/blog/${c.post_slug}`} className="hover:text-primary">/blog/{c.post_slug}</a></span>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[c.status]}`}>
                {c.status === "pending" ? "Pendiente" : c.status === "published" ? "Publicado" : "Rechazado"}
              </span>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-foreground">{c.body}</p>

            <div className="flex gap-2">
              {c.status !== "published" && (
                <form action={async () => { "use server"; await moderateComment(c.id, "published"); }}>
                  <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-500/20 dark:text-green-400 transition-colors">
                    <CheckCircle className="h-3.5 w-3.5" /> Publicar
                  </button>
                </form>
              )}
              {c.status !== "rejected" && (
                <form action={async () => { "use server"; await moderateComment(c.id, "rejected"); }}>
                  <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-500/20 dark:text-amber-400 transition-colors">
                    <XCircle className="h-3.5 w-3.5" /> Rechazar
                  </button>
                </form>
              )}
              <form action={async () => { "use server"; await deleteComment(c.id); }}>
                <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-500/20 dark:text-red-400 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
