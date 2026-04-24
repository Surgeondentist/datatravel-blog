import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/**
 * App Router robots.txt. Do not list private routes or non-SEO handlers.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio/",
        "/admin/",
        "/auth/",
        "/api/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: safeHost(base),
  };
}

function safeHost(base: string): string {
  try {
    return new URL(base).host;
  } catch {
    return "localhost";
  }
}
