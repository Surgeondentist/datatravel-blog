import { client } from "@/sanity/lib/client";
import { postBySlugQuery, postsQuery } from "@/sanity/lib/queries";
import { PortableText } from "next-sanity";
import Image from "next/image";
import { portablePostBodyComponents } from "@/components/blog/portableTextComponents";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import AdUnit from "@/components/AdUnit";
import CommentSection from "@/components/comments/CommentSection";
import type { Metadata } from "next";

export const revalidate = 3600;

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  category?: string;
  readTime?: number;
  publishedAt?: string;
  coverImage?: { asset: { url: string }; alt?: string };
  body?: unknown[];
  seoTitle?: string;
  seoDescription?: string;
};

const categoryLabels: Record<string, string> = {
  tecnologia: "Tecnología",
  "inteligencia-artificial": "Inteligencia artificial",
  ciberseguridad: "Ciberseguridad",
  guias: "Guías y herramientas",
};

const categoryColors: Record<string, string> = {
  tecnologia: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/45 dark:text-cyan-200",
  "inteligencia-artificial": "bg-sky-100 text-sky-800 dark:bg-sky-900/45 dark:text-sky-200",
  ciberseguridad: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/45 dark:text-emerald-200",
  guias: "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-200",
};

export async function generateStaticParams() {
  try {
    const posts: Post[] = await client.fetch(postsQuery);
    return posts.map((p) => ({ slug: p.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post: Post | null = await client.fetch(postBySlugQuery, { slug });
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    openGraph: { title: post.seoTitle ?? post.title, description: post.seoDescription ?? post.excerpt },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: Post | null = null;
  try {
    post = await client.fetch(postBySlugQuery, { slug });
  } catch {
    notFound();
  }
  if (!post) notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <main>
      {/* Ad — top */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <AdUnit />
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver a artículos
        </Link>

        {post.category && (
          <Badge className={`mb-5 border-0 ${categoryColors[post.category] ?? "bg-secondary text-secondary-foreground"}`}>
            {categoryLabels[post.category] ?? post.category}
          </Badge>
        )}

        <h1 className="mb-5 font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}

        <div className="mb-8 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          {date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary/60" />{date}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary/60" />{post.readTime} min de lectura
            </span>
          )}
        </div>

        {post.coverImage?.asset?.url && (
          <div className="relative mb-10 h-64 w-full overflow-hidden rounded-2xl md:h-[420px]">
            <Image
              src={post.coverImage.asset.url}
              alt={post.coverImage.alt ?? post.title}
              fill
              sizes="(max-width: 768px) 100vw, min(896px, 100vw)"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Ad — in-article top */}
        {process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE ? (
          <div className="mb-8">
            <AdUnit
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE}
              format="fluid"
              layout="in-article"
              fullWidthResponsive={false}
            />
          </div>
        ) : null}

        <div className="prose prose-neutral dark:prose-invert prose-headings:font-heading prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl max-w-none">
          {post.body && (
            <PortableText
              value={post.body as Parameters<typeof PortableText>[0]["value"]}
              components={portablePostBodyComponents}
            />
          )}
        </div>

        {/* Ad — mid article square */}
        {process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID ? (
          <div className="my-10">
            <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MID} />
          </div>
        ) : null}
      </article>

      {/* Comentarios */}
      <div className="mx-auto max-w-3xl px-4 pb-4">
        <CommentSection postSlug={slug} />
      </div>

      {/* Ad — below article */}
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <AdUnit />
      </div>
    </main>
  );
}
