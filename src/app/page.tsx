import Link from "next/link";
import { ArrowRight, BookOpen, Cpu, Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PostCard from "@/components/blog/PostCard";
import AdUnit from "@/components/AdUnit";
import NewsletterForm from "@/components/NewsletterForm";
import { client } from "@/sanity/lib/client";
import { latestPostsQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const categories = [
  { slug: "tecnologia", label: "Tecnología", icon: "✦" },
  { slug: "inteligencia-artificial", label: "Inteligencia artificial", icon: "✦" },
  { slug: "ciberseguridad", label: "Ciberseguridad", icon: "✦" },
  { slug: "guias", label: "Guías y herramientas", icon: "✦" },
];

const pillars = [
  { icon: BookOpen, title: "Fondo y contexto", desc: "Qué significa cada avance técnico y cómo te afecta en la práctica." },
  { icon: Cpu, title: "IA y producto", desc: "Modelos, herramientas y buenas prácticas para usar la IA con criterio." },
  { icon: Shield, title: "Seguridad primero", desc: "Amenazas, defensa en profundidad y hábitos que reducen riesgos reales." },
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
      <section className="relative min-h-[92svh] overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(34,211,238,0.35),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(56,189,248,0.18),transparent)]" />
        <div aria-hidden="true" className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl motion-safe:animate-pulse" />
        <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl motion-safe:animate-pulse motion-safe:[animation-delay:1s]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-32 text-center">
          <Badge className="mb-6 border border-cyan-400/30 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/15 backdrop-blur-sm">
            <Sparkles className="mr-1.5 h-3 w-3" />
            Blogtech
          </Badge>

          <h1 className="mb-6 font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-7xl">
            Tecnología, IA y{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-sky-200 bg-clip-text text-transparent">
              ciberseguridad
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300/90 md:text-xl">
            Artículos y guías para entender el software que nos rodea, adoptar la inteligencia artificial con criterio
            y endurecer tu postura de seguridad sin humo ni sensacionalismo.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:bg-cyan-50"
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

          <div className="mt-20 flex flex-col items-center gap-2 text-cyan-200/40">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-8 w-px bg-gradient-to-b from-cyan-300/50 to-transparent" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <AdUnit />
      </div>

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

      <section id="categorias" className="py-20 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">Explora por tema</h2>
            <p className="mt-3 text-muted-foreground">Encuentra contenido alineado con lo que necesitas aprender o aplicar</p>
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

      <div className="mx-auto max-w-6xl px-4 py-6">
        <AdUnit />
      </div>

      {posts.length > 0 && (
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 via-slate-50/40 to-sky-100/50 dark:from-cyan-950/40 dark:via-slate-900/30 dark:to-sky-950/40" />
          <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-600/10" />
          <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-600/10" />
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground">Artículos recientes</h2>
                <p className="mt-2 text-muted-foreground">Lo último en tecnología, IA y seguridad</p>
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

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(34,211,238,0.22),transparent)]" />
        <div className="relative mx-auto max-w-xl px-4 text-center">
          <Sparkles aria-hidden="true" className="mx-auto mb-4 h-8 w-8 text-cyan-300/60" />
          <h2 className="mb-3 font-heading text-3xl font-bold text-white">Boletín</h2>
          <p className="mb-8 text-slate-300/80">Nuevos artículos, recursos y enlaces curados. Sin ruido.</p>
          <NewsletterForm />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <AdUnit />
      </div>
    </main>
  );
}
