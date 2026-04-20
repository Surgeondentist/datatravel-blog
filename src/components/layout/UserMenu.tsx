"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogIn, LogOut, Shield, ChevronDown } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { safeAvatarUrl } from "@/lib/safe-avatar-url";

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
};

export default function UserMenu() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) fetchProfile(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url, role")
      .eq("id", userId)
      .single();
    if (data) setProfile(data);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setOpen(false);
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary/20 cursor-pointer"
      >
        <LogIn className="h-3.5 w-3.5" />
        Entrar
      </button>
    );
  }

  const name = profile?.display_name ?? user.user_metadata?.full_name ?? user.email ?? "Usuario";
  const avatar = safeAvatarUrl(profile?.avatar_url ?? user.user_metadata?.avatar_url ?? null);
  const isAdmin = profile?.role === "admin";
  const initials = name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 p-1 pr-3 transition-all hover:border-primary/40 hover:bg-secondary cursor-pointer"
        aria-label="Menú de usuario"
      >
        {/* Avatar */}
        <div className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-primary/30">
          {avatar ? (
            <img src={avatar} alt={name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
              {initials}
            </div>
          )}
        </div>
        <span className="hidden max-w-[96px] truncate text-sm font-medium text-foreground sm:block">
          {name.split(" ")[0]}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-white/20 bg-background/90 shadow-xl shadow-black/10 backdrop-blur-xl dark:border-white/10 dark:bg-background/95 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/60 bg-primary/5 px-4 py-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/40">
              {avatar ? (
                <img src={avatar} alt={name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Links */}
          <div className="p-2">
            {isAdmin && (
              <Link
                href="/admin/comentarios"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Shield className="h-4 w-4 text-primary" />
                <span>Panel de moderación</span>
                <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Admin</span>
              </Link>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border/60 p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
