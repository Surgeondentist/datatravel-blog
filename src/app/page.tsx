import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PostCard from "@/components/blog/PostCard";
import { client } from "@/sanity/lib/client";
import { latestPostsQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

const categories = [
  { slug: "salud-sexual", label: "Salud Sexual", icon: "✦" },
  { slug: "relaciones", label: "Relaciones de Pareja", icon: "✦" },
  { slug: "educacion", label: "Educación Sexual", icon: "✦" },
  { slug: "bienestar", label: "Bienestar", icon: "✦" },
];

const pillars = [
  { icon: BookOpen, title: "Basado en evidencia", desc: "Contenido respaldado por ciencia y profesionales certificados." },
  { icon: Heart, title: "Sin tabúes", desc: "Abordamos todos los temas con respeto, apertura y precisión." },
  { icon: Shield, title: "Espacio seguro", desc: "Tu privacidad importa. Información confiable, sin juzgar." },
];

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  readTime?: number;
  publishedAt?: string;
  coverImage?: { asset: { url: string }; alt?: string };
};

export default async function HomePage() {
  let posts: Post[] = [];
  try {
    posts = await client.fetch(latestPostsQuery);
  } catch {
    posts = [];
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] overflow-hidden flex items-center">
        {/* Background: layered gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(139,92,246,0.5),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(167,139,250,0.2),transparent)]" />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse [animation-delay:1s]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-32 text-center">
          <Badge className="mb-6 border border-violet-400/30 bg-violet-500/20 text-violet-200 hover:bg-violet-500/20 backdrop-blur-sm">
            <Sparkles className="mr-1.5 h-3 w-3" />
            Vínculo Consciente
          </Badge>

          <h1 className="mb-6 font-heading text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
            Tu salud sexual{" "}
            <span className="bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
              importa
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-violet-200/80 md:text-xl">
            Artículos, guías y respuestas a las preguntas que te cuesta hacer.
            Información sexual honesta, real y sin tabúes.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-violet-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:bg-violet-50"
            >
              Explorar artículos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#categorias"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              Ver categorías
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-violet-300/50">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-violet-300/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Ad slot — below hero ── */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="ad-slot h-24">Espacio publicitario — Leaderboard 728×90</div>
      </div>

      {/* ── Pilares ── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-md">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section id="categorias" className="py-20 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">Explora por tema</h2>
            <p className="mt-3 text-muted-foreground">Encuentra exactamente lo que necesitas</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ad slot — mid page ── */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="ad-slot h-24">Espacio publicitario — Banner 970×90</div>
      </div>

      {/* ── Artículos recientes ── */}
      {posts.length > 0 && (
        <section className="relative overflow-hidden py-20">
          {/* Background for glassmorphism effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-100/60 via-purple-50/40 to-indigo-100/60 dark:from-violet-950/60 dark:via-purple-900/30 dark:to-indigo-950/60" />
          <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-600/10" />
          <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/10" />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground">Artículos recientes</h2>
                <p className="mt-2 text-muted-foreground">Lo último en sexología y bienestar</p>
              </div>
              <Link href="/blog" className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <PostCard key={post._id} post={post} featured={i === 0} />
              ))}
            </div>
            <div className="mt-8 flex justify-center sm:hidden">
              <Link href="/blog" className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                Ver todos los artículos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Newsletter ── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(139,92,246,0.3),transparent)]" />
        <div className="relative mx-auto max-w-xl px-4 text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-violet-300/60" />
          <h2 className="mb-3 font-heading text-3xl font-bold text-white">Recibe contenido en tu correo</h2>
          <p className="mb-8 text-violet-200/70">Artículos nuevos, guías exclusivas y respuestas a tus preguntas.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-violet-300/50 outline-none backdrop-blur-sm focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            />
            <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-900 transition-all hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-lg cursor-pointer">
              Suscribirme
            </button>
          </div>
        </div>
      </section>

      {/* ── Ad slot — above footer ── */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="ad-slot h-24">Espacio publicitario — Leaderboard 728×90</div>
      </div>
    </main>
  );
}
