"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";

const categoryLabels: Record<string, string> = {
  tecnologia: "Tecnología",
  "inteligencia-artificial": "IA",
  ciberseguridad: "Ciberseguridad",
  guias: "Guías",
};

const categoryColors: Record<string, string> = {
  tecnologia: "bg-cyan-500/20 text-cyan-100 border-cyan-400/25",
  "inteligencia-artificial": "bg-sky-500/20 text-sky-100 border-sky-400/25",
  ciberseguridad: "bg-emerald-500/20 text-emerald-100 border-emerald-400/25",
  guias: "bg-slate-500/25 text-slate-100 border-slate-400/20",
};

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

export default function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const href = `/blog/${post.slug.current}`;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })
    : null;

  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.12 });
  }

  function handleMouseLeave() {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlare((g) => ({ ...g, opacity: 0 }));
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Glassmorphism base */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5" />

      {/* Glare effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
          transition: "opacity 0.15s ease",
        }}
      />

      {/* Inner glow border */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 dark:ring-white/10" />

      <Link href={href} className="relative flex flex-col">
        {/* Image */}
        <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-cyan-600/35 to-slate-800/50 ${featured ? "h-52" : "h-44"}`}>
          {post.coverImage?.asset?.url ? (
            <Image
              src={post.coverImage.asset.url}
              alt={post.coverImage.alt ?? post.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <SparkleIcon />
            </div>
          )}
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {post.category && (
            <div className="absolute left-3 top-3">
              <Badge className={`border text-xs font-medium backdrop-blur-sm ${categoryColors[post.category] ?? "bg-white/10 text-white/70 border-white/10"}`}>
                {categoryLabels[post.category] ?? post.category}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col p-5">
          <h3 className={`mb-2 font-heading font-semibold leading-snug text-foreground transition-colors hover:text-primary ${featured ? "text-xl" : "text-base"}`}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> {date}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> {post.readTime} min
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/30" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}
