import type { Metadata } from "next";
import { Lora, Raleway } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Vínculo Consciente — Sexología y bienestar sexual",
    template: "%s | Vínculo Consciente",
  },
  description:
    "Artículos de sexología, salud sexual y relaciones de pareja. Información basada en evidencia, honesta y sin tabúes.",
  keywords: ["sexología", "vínculo consciente", "salud sexual", "educación sexual", "relaciones de pareja", "bienestar"],
  openGraph: {
    siteName: "Vínculo Consciente",
    locale: "es_ES",
    type: "website",
  },
  other: {
    "google-adsense-account": "ca-pub-4094870352712876",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${lora.variable} ${raleway.variable} h-full`} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3BJ2C3CK6M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3BJ2C3CK6M');
          `}
        </Script>
        <Script
          id="adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4094870352712876"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
