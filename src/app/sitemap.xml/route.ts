import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

/** xmlns del protocolo de sitemaps debe ser http (no https), según el estándar. */
const URLSET_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";

type Post = {
  slug: { current: string };
  publishedAt?: string;
};

function escapeXmlLoc(url: string): string {
  return url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** W3C Datetime (ISO 8601), recomendado para lastmod. */
function w3cDatetime(d: Date): string {
  return d.toISOString();
}

export async function GET() {
  const base = getSiteUrl();

  let posts: Post[] = [];
  try {
    posts = await client.fetch(postsQuery);
  } catch {
    posts = [];
  }

  const now = w3cDatetime(new Date());
  const entries: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    { loc: base, lastmod: now, changefreq: "daily", priority: "1.0" },
    { loc: `${base}/blog`, lastmod: now, changefreq: "daily", priority: "0.9" },
    ...posts.map((post) => ({
      loc: `${base}/blog/${post.slug.current}`,
      lastmod: post.publishedAt ? w3cDatetime(new Date(post.publishedAt)) : now,
      changefreq: "weekly",
      priority: "0.8",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="${URLSET_NS}">
${entries
  .map(
    (e) => `  <url>
    <loc>${escapeXmlLoc(e.loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
