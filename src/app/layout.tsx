import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import AdSenseScript from "@/components/AdSenseScript";
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
    default: "Blogtech — Tecnología, IA y ciberseguridad",
    template: "%s | Blogtech",
  },
  description:
    "Artículos sobre tecnología, inteligencia artificial y ciberseguridad. Análisis claros, buenas prácticas y herramientas para mantenerte al día.",
  keywords: [
    "tecnología",
    "inteligencia artificial",
    "ciberseguridad",
    "IA",
    "privacidad",
    "blog técnico",
  ],
  openGraph: {
    siteName: "Blogtech",
    locale: "es_ES",
    type: "website",
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
      lang="es"
      className={`${jetbrainsMono.variable} ${inter.variable} h-full`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
            </Script>
          </>
        ) : null}
      </head>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <AdSenseScript />
        <ThemeProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
