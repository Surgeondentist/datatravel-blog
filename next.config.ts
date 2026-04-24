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
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseWs = supabaseOrigin.replace(/^https:\/\//, "wss://");

function buildCsp(): string {
  const imgSrc = [
    "'self'", "data:", "blob:",
    "https://cdn.sanity.io",
    "https://lh3.googleusercontent.com",
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://googleads.g.doubleclick.net",
    "https://www.google.com",
    ...(supabaseHost ? [`https://${supabaseHost}`] : []),
  ].join(" ");

  const connectSrc = [
    "'self'",
    "https://www.google-analytics.com",
    "https://analytics.google.com",
    "https://region1.google-analytics.com",
    "https://stats.g.doubleclick.net",
    "https://www.googletagmanager.com",
    ...(supabaseOrigin ? [supabaseOrigin, supabaseWs] : []),
  ].join(" ");

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://www.google-analytics.com https://googleads.g.doubleclick.net",
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSrc}`,
    "font-src 'self'",
    `connect-src ${connectSrc}`,
    "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.googletagmanager.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy",   value: buildCsp() },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/privacidad", destination: "/privacy", permanent: true },
      { source: "/aviso-legal", destination: "/legal", permanent: true },
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
