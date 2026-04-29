import NewsletterForm from "@/components/NewsletterForm";
import { getLocale } from "@/lib/get-locale";
import { uiMessages } from "@/messages/ui";

/**
 * Inline newsletter block for light layouts (blog index, post, etc.).
 */
export default async function NewsletterSection() {
  const locale = await getLocale();
  const t = uiMessages[locale];

  return (
    <section className="border-y border-border bg-secondary/25 py-12" aria-labelledby="newsletter-inline-heading">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 id="newsletter-inline-heading" className="font-heading text-2xl font-bold tracking-tight text-foreground">
          {t.newsletterInline.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.newsletterInline.subtitle}</p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <NewsletterForm variant="card" />
        </div>
      </div>
    </section>
  );
}
