import { client } from "@/sanity/lib/client";
import { postsQuery, postsByCategory } from "@/sanity/lib/queries";
import PostCard from "@/components/blog/PostCard";
import NewsletterSection from "@/components/NewsletterSection";
import AdUnit from "@/components/AdUnit";
import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/lib/get-locale";
import { uiMessages } from "@/messages/ui";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = uiMessages[locale];
  return {
    title: t.blog.metaTitle,
    description: t.blog.metaDescription,
    alternates: { canonical: "/blog" },
  };
}

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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const locale = await getLocale();
  const t = uiMessages[locale];

  const categories = [
    { slug: "", label: t.blog.filterAll },
    { slug: "tecnologia", label: t.categories.tecnologia.pill },
    { slug: "inteligencia-artificial", label: t.categories["inteligencia-artificial"].pill },
    { slug: "ciberseguridad", label: t.categories.ciberseguridad.pill },
    { slug: "guias", label: t.categories.guias.pill },
  ];

  const { category } = await searchParams;
  let posts: Post[] = [];
  try {
    posts = await client.fetch(
      category ? postsByCategory : postsQuery,
      category ? { category } : {}
    );
  } catch {
    posts = [];
  }

  const activeLabel = categories.find((c) => c.slug === (category ?? ""))?.label ?? t.blog.metaTitle;
  const heading = category ? activeLabel : t.blog.headingAll;

  return (
    <main>
      <section className="border-b border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">{heading}</h1>
          <p className="mt-4 text-muted-foreground">{t.blog.subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="py-6">
          <AdUnit />
        </div>

        <div className="flex flex-wrap justify-center gap-2 py-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug || "all"}
              href={cat.slug ? `/blog?category=${cat.slug}` : "/blog"}
              aria-current={(category ?? "") === cat.slug ? "page" : undefined}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                (category ?? "") === cat.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-muted-foreground">{t.blog.emptyCategory}</p>
          </div>
        ) : (
          <div className="grid gap-6 pb-12 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} featured={i === 0} />
            ))}
          </div>
        )}

        <NewsletterSection />

        <div className="pb-8">
          <AdUnit />
        </div>
      </div>
    </main>
  );
}
