import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/get-locale";
import { uiMessages } from "@/messages/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = uiMessages[locale];
  return {
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    alternates: { canonical: "/privacy" },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const t = uiMessages[locale];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          {t.common.home}
        </Link>
        <span className="mx-2">/</span>
        {t.privacy.breadcrumb}
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">{t.privacy.title}</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-p:text-muted-foreground prose-headings:text-foreground">
        <p>{t.privacy.p1}</p>
        <p>{t.privacy.p2}</p>
        <p className="text-sm">{t.privacy.p3}</p>
      </div>
    </main>
  );
}
