import NewsletterForm from "@/components/NewsletterForm";

/**
 * Inline newsletter block for light layouts (blog index, post, etc.).
 */
export default function NewsletterSection() {
  return (
    <section className="border-y border-border bg-secondary/25 py-12" aria-labelledby="newsletter-inline-heading">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 id="newsletter-inline-heading" className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Stay in the loop
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          New articles and curated links—no spam.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <NewsletterForm variant="card" />
        </div>
      </div>
    </section>
  );
}
