import { createClient } from "@/lib/supabase/server";
import { moderateComment, deleteComment } from "@/app/actions/comments";
import { CheckCircle, XCircle, Trash2, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Comments" };

type Comment = {
  id: string;
  body: string;
  status: string;
  post_slug: string;
  created_at: string;
  profiles: { display_name: string; email: string };
};

const statusBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export default async function AdminCommentsPage() {
  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("id, body, status, post_slug, created_at, profiles(display_name, email)")
    .order("created_at", { ascending: false }) as { data: Comment[] | null };

  const pending = comments?.filter((c) => c.status === "pending") ?? [];
  const published = comments?.filter((c) => c.status === "published") ?? [];
  const rejected = comments?.filter((c) => c.status === "rejected") ?? [];

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Comments</h2>
        <div className="flex gap-2 text-sm">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            {pending.length} pending
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-muted-foreground">
            {published.length} published
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-muted-foreground">
            {rejected.length} rejected
          </span>
        </div>
      </div>

      {pending.length === 0 && comments?.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <Clock className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p>No comments yet.</p>
        </div>
      )}

      {pending.length === 0 && (comments?.length ?? 0) > 0 && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300">
          No comments pending review.
        </div>
      )}

      <div className="space-y-3">
        {comments?.map((c) => (
          <div
            key={c.id}
            className={`rounded-2xl border bg-card p-5 ${c.status === "pending" ? "border-amber-200 dark:border-amber-800" : "border-border"}`}
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div className="text-sm">
                <span className="font-medium text-foreground">{c.profiles?.display_name ?? "—"}</span>
                <span className="ml-2 text-muted-foreground">{c.profiles?.email}</span>
                <span className="ml-2 text-muted-foreground">· {date(c.created_at)}</span>
                <span className="ml-2 text-muted-foreground">
                  ·{" "}
                  <a href={`/blog/${c.post_slug}`} className="hover:text-primary transition-colors">
                    /blog/{c.post_slug}
                  </a>
                </span>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[c.status]}`}>
                {c.status === "pending" ? "Pending" : c.status === "published" ? "Published" : "Rejected"}
              </span>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-foreground">{c.body}</p>

            <div className="flex gap-2">
              {c.status !== "published" && (
                <form action={async () => { "use server"; await moderateComment(c.id, "published"); }}>
                  <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-500/20 dark:text-green-400">
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </button>
                </form>
              )}
              {c.status !== "rejected" && (
                <form action={async () => { "use server"; await moderateComment(c.id, "rejected"); }}>
                  <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-400">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </form>
              )}
              <form action={async () => { "use server"; await deleteComment(c.id); }}>
                <button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-500/20 dark:text-red-400">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
