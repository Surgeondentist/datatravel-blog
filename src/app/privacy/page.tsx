import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Redshell handles your data.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        Privacy
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Privacy policy</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-p:text-muted-foreground prose-headings:text-foreground">
        <p>
          This site may use technical providers (hosting, analytics, advertising, authentication, and CMS) under their
          own policies. Data you submit through forms (for example, newsletter or comments) will be used only for that
          purpose.
        </p>
        <p>
          You may request access, correction, or deletion where applicable law allows, using the contact methods
          published on the site.
        </p>
        <p className="text-sm">
          This text is for guidance only; have it reviewed by legal counsel before relying on it in your jurisdiction.
        </p>
      </div>
    </main>
  );
}
