import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { redirect } from "next/navigation";
import { Mail, Users, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Subscribers" };

type Subscriber = {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
};

export default async function AdminSubscribersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/");

  let subscribers: Subscriber[] | null = null;
  let loadError: string | null = null;

  const service = createServiceRoleClient();
  if (service) {
    const { data, error } = await service
      .from("subscribers")
      .select("id, email, confirmed, created_at")
      .order("created_at", { ascending: false });
    if (error) loadError = error.message;
    else subscribers = data as Subscriber[] | null;
  } else {
    const { data, error } = await supabase
      .from("subscribers")
      .select("id, email, confirmed, created_at")
      .order("created_at", { ascending: false });
    if (error) loadError = error.message;
    else subscribers = data as Subscriber[] | null;
  }

  const total = subscribers?.length ?? 0;
  const confirmed = subscribers?.filter((s) => s.confirmed).length ?? 0;

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      {loadError && (
        <div className="mb-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Could not load subscribers: {loadError}. If you use RLS, run the SQL in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">supabase/sql/subscribers_rls.sql</code> or set{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code> on the server only (Vercel).
        </div>
      )}

      {/* Header + stats */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">Subscribers</h2>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{total}</span>
            <span className="text-muted-foreground">total</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm">
            <Mail className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-foreground">{confirmed}</span>
            <span className="text-muted-foreground">confirmed</span>
          </div>
        </div>
      </div>

      {total === 0 && !loadError ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <Mail className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="font-medium">No subscribers visible yet.</p>
          <p className="mt-1 text-sm">
            If you subscribed but your email does not appear, Supabase is likely blocking reads (RLS). Add{" "}
            <code className="rounded bg-muted px-1 text-xs">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel or run{" "}
            <code className="rounded bg-muted px-1 text-xs">supabase/sql/subscribers_rls.sql</code> in the SQL Editor.
          </p>
        </div>
      ) : total === 0 ? null : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-5 py-3.5 text-left font-semibold text-foreground">Email</th>
                <th className="px-5 py-3.5 text-left font-semibold text-foreground">Status</th>
                <th className="px-5 py-3.5 text-left font-semibold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Date
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers?.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-3.5 font-medium text-foreground">{s.email}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.confirmed
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${s.confirmed ? "bg-green-500" : "bg-muted-foreground/50"}`} />
                      {s.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{date(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
