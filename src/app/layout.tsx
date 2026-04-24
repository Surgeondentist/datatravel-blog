import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteUrl } from "@/lib/site";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

function metadataBaseUrl(): URL {
  try {
    return new URL(getSiteUrl());
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
  title: {
    default: "Redshell — Technology, AI & cybersecurity",
    template: "%s | Redshell",
  },
  description:
    "Articles on technology, artificial intelligence, and cybersecurity. Clear analysis, solid practices, and tools to stay current.",
  keywords: [
    "technology",
    "artificial intelligence",
    "cybersecurity",
    "AI",
    "privacy",
    "tech blog",
    "redshell",
  ],
  openGraph: {
    siteName: "Redshell",
    locale: "en_US",
    type: "website",
    images: [{ url: "/redshell-logo.png", alt: "Redshell — Turn on cybersecurity" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/redshell-logo.png"],
  },
  icons: {
    icon: [{ url: "/redshell-logo.png", type: "image/png" }],
    apple: "/redshell-logo.png",
  },
  ...(adsenseClient
    ? { other: { "google-adsense-account": adsenseClient } as Record<string, string> }
    : {}),
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${inter.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {gaId ? (
          <>
            {/* beforeInteractive: in initial HTML so tag assistants detect it without late JS */}
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="beforeInteractive" />
            <Script id="google-analytics" strategy="beforeInteractive">
              {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');
              `.trim()}
            </Script>
          </>
        ) : null}
        {adsenseClient ? (
          <Script
            id="adsense-init"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            strategy="beforeInteractive"
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
