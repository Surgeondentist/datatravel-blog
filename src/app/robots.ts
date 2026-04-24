import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/**
 * robots.txt nativo (App Router). No listar rutas privadas ni handlers que no aportan SEO.
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
