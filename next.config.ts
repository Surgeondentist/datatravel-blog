import type { NextConfig } from "next";

function supabaseStorageHostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}

const supabaseHost = supabaseStorageHostname();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/studio",
        destination: "https://redshell.sanity.studio",
        permanent: false,
      },
      {
        source: "/studio/:path*",
        destination: "https://redshell.sanity.studio/:path*",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
