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

/** lastmod en formato de fecha (YYYY-MM-DD), sin fracciones; aceptado por el protocolo de sitemaps y Google. */
function sitemapLastmod(d: Date): string {
  const t = d.getTime();
  if (Number.isNaN(t)) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const base = getSiteUrl();

  let posts: Post[] = [];
  try {
    posts = await client.fetch(postsQuery);
  } catch {
    posts = [];
  }

  const withSlug = posts.filter((p) => typeof p.slug?.current === "string" && p.slug.current.length > 0);

  const now = sitemapLastmod(new Date());
  const entries: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    { loc: base, lastmod: now, changefreq: "daily", priority: "1.0" },
    { loc: `${base}/blog`, lastmod: now, changefreq: "daily", priority: "0.9" },
    ...withSlug.map((post) => ({
      loc: `${base}/blog/${post.slug!.current}`,
      lastmod: post.publishedAt ? sitemapLastmod(new Date(post.publishedAt)) : now,
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
