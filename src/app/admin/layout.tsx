import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import AdminTabs from "@/components/admin/AdminTabs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Panel de administración</h1>
              <p className="text-xs text-muted-foreground">Vínculo Consciente</p>
            </div>
          </div>
          <AdminTabs />
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
