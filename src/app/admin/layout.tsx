import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminTabs from "@/components/admin/AdminTabs";
import BrandLogo from "@/components/brand/BrandLogo";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Panel de administración</h1>
              <p className="text-xs text-muted-foreground">Redshell</p>
            </div>
          </div>
          <AdminTabs />
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
