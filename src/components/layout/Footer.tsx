import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import BrandLogo from "@/components/brand/BrandLogo";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-14 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="mb-4 inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
              <BrandLogo size="sm" />
            </Link>
            <p className="leading-relaxed">
              Technology, artificial intelligence, and cybersecurity—explained with rigor and plain language.
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:gap-16 lg:gap-20">
            <div>
              <p className="mb-4 font-medium text-foreground">Topics</p>
              <ul className="space-y-2.5">
                <li><Link href="/blog?category=tecnologia" className="transition-colors hover:text-primary">Technology</Link></li>
                <li><Link href="/blog?category=inteligencia-artificial" className="transition-colors hover:text-primary">Artificial intelligence</Link></li>
                <li><Link href="/blog?category=ciberseguridad" className="transition-colors hover:text-primary">Cybersecurity</Link></li>
                <li><Link href="/blog?category=guias" className="transition-colors hover:text-primary">Guides & tools</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 font-medium text-foreground">Legal</p>
              <ul className="space-y-2.5">
                <li><Link href="/privacy" className="transition-colors hover:text-primary">Privacy</Link></li>
                <li><Link href="/legal" className="transition-colors hover:text-primary">Legal notice</Link></li>
              </ul>
            </div>
            <div className="max-w-xs sm:max-w-[220px]">
              <p className="mb-4 font-medium text-foreground">Newsletter</p>
              <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                Occasional updates—new posts and links we find useful.
              </p>
              <NewsletterForm variant="card" />
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <p className="text-center text-xs">
          © {new Date().getFullYear()} Redshell — Informational content; not a substitute for specialized professional advice.
        </p>
      </div>
    </footer>
  );
}
