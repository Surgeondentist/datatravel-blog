import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import type { MetadataRoute } from "next";

const BASE_URL = "https://vinculo-consciente.vercel.app";

type Post = {
  slug: { current: string };
  publishedAt?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Post[] = [];
  try {
    posts = await client.fetch(postsQuery);
  } catch {
    posts = [];
  }

  const postEntries = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug.current}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...postEntries,
  ];
}
