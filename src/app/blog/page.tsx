import { client } from "@/sanity/lib/client";
import { postsQuery, postsByCategory } from "@/sanity/lib/queries";
import PostCard from "@/components/blog/PostCard";
import AdUnit from "@/components/AdUnit";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Artículos",
  description: "Todos los artículos sobre tecnología, inteligencia artificial y ciberseguridad.",
};

const categories = [
  { slug: "", label: "Todos" },
  { slug: "tecnologia", label: "Tecnología" },
  { slug: "inteligencia-artificial", label: "IA" },
  { slug: "ciberseguridad", label: "Ciberseguridad" },
  { slug: "guias", label: "Guías" },
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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
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

  const activeLabel = categories.find((c) => c.slug === (category ?? ""))?.label ?? "Artículos";

  return (
    <main>
      <section className="border-b border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
            {category ? activeLabel : "Todos los artículos"}
          </h1>
          <p className="mt-4 text-muted-foreground">Análisis, guías y buenas prácticas para equipos y curiosos técnicos.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="py-6">
          <AdUnit />
        </div>

        <div className="flex flex-wrap justify-center gap-2 py-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
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
            <p className="text-lg text-muted-foreground">Aún no hay artículos en esta categoría. Publica desde Sanity Studio.</p>
          </div>
        ) : (
          <div className="grid gap-6 pb-16 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard key={post._id} post={post} featured={i === 0} />
            ))}
          </div>
        )}

        <div className="pb-8">
          <AdUnit />
        </div>
      </div>
    </main>
  );
}
