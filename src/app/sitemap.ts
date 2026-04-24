import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/site";

/** ISR del índice de URLs (alineado con páginas de blog). */
export const revalidate = 3600;

type Post = { slug: { current: string }; publishedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  let posts: Post[] = [];
  try {
    posts = await client.fetch(postsQuery);
  } catch {
    posts = [];
  }

  const withSlug = posts.filter((p) => typeof p.slug?.current === "string" && p.slug.current.length > 0);

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/aviso-legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...withSlug.map((post) => ({
      url: `${base}/blog/${post.slug!.current}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
