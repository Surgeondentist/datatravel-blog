import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal notice",
  description: "Legal information for the Redshell website.",
  alternates: { canonical: "/legal" },
  robots: { index: true, follow: true },
};

export default function LegalNoticePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        Legal notice
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Legal notice</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-p:text-muted-foreground prose-headings:text-foreground">
        <p>
          The site operator provides this website for informational purposes. Unless expressly stated otherwise, the
          content does not constitute professional, medical, legal, or security advice.
        </p>
        <p>
          Links to third parties are provided for convenience; we are not responsible for external content. Trademarks
          and trade names mentioned may belong to their respective owners.
        </p>
        <p className="text-sm">
          This text is for guidance only; complete it with identifying details, governing law, and contact information
          for your country and activity.
        </p>
      </div>
    </main>
  );
}
