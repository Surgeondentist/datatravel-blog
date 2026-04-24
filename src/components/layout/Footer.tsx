import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import BrandLogo from "@/components/brand/BrandLogo";

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
              Tecnología, inteligencia artificial y ciberseguridad explicadas con rigor y un lenguaje accesible.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="mb-4 font-medium text-foreground">Temas</p>
              <ul className="space-y-2.5">
                <li><Link href="/blog?category=tecnologia" className="transition-colors hover:text-primary">Tecnología</Link></li>
                <li><Link href="/blog?category=inteligencia-artificial" className="transition-colors hover:text-primary">Inteligencia artificial</Link></li>
                <li><Link href="/blog?category=ciberseguridad" className="transition-colors hover:text-primary">Ciberseguridad</Link></li>
                <li><Link href="/blog?category=guias" className="transition-colors hover:text-primary">Guías y herramientas</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 font-medium text-foreground">Legal</p>
              <ul className="space-y-2.5">
                <li><Link href="/privacidad" className="transition-colors hover:text-primary">Privacidad</Link></li>
                <li><Link href="/aviso-legal" className="transition-colors hover:text-primary">Aviso Legal</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <p className="text-center text-xs">
          © {new Date().getFullYear()} Redshell — Contenido informativo; no sustituye asesoramiento profesional especializado.
        </p>
      </div>
    </footer>
  );
}
