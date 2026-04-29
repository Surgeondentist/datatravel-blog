import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import BrandLogo from "@/components/brand/BrandLogo";
import NewsletterForm from "@/components/NewsletterForm";
import { getLocale } from "@/lib/get-locale";
import { uiMessages } from "@/messages/ui";

export default async function Footer() {
  const locale = await getLocale();
  const t = uiMessages[locale];

  return (
    <footer className="border-t border-border bg-card py-14 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="mb-4 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
              <BrandLogo size="sm" />
            </Link>
            <p className="leading-relaxed">{t.footer.tagline}</p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:gap-16 lg:gap-20">
            <div>
              <p className="mb-4 font-medium text-foreground">{t.footer.topics}</p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/blog?category=tecnologia" className="transition-colors hover:text-primary">
                    {t.categories.tecnologia.long}
                  </Link>
                </li>
                <li>
                  <Link href="/blog?category=inteligencia-artificial" className="transition-colors hover:text-primary">
                    {t.categories["inteligencia-artificial"].long}
                  </Link>
                </li>
                <li>
                  <Link href="/blog?category=ciberseguridad" className="transition-colors hover:text-primary">
                    {t.categories.ciberseguridad.long}
                  </Link>
                </li>
                <li>
                  <Link href="/blog?category=guias" className="transition-colors hover:text-primary">
                    {t.categories.guias.long}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 font-medium text-foreground">{t.footer.legal}</p>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-primary">
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="transition-colors hover:text-primary">
                    {t.footer.legalNotice}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="max-w-xs sm:max-w-[220px]">
              <p className="mb-4 font-medium text-foreground">{t.footer.newsletter}</p>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{t.footer.newsletterBlurb}</p>
              <NewsletterForm variant="card" />
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <p className="text-center text-xs">
          © {new Date().getFullYear()} Redshell — {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
