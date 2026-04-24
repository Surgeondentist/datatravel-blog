import Link from "next/link";
import { Cpu } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-14 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Cpu className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-semibold text-foreground">
                Blog<span className="text-primary">tech</span>
              </span>
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
          © {new Date().getFullYear()} Blogtech — Contenido informativo; no sustituye asesoramiento profesional especializado.
        </p>
      </div>
    </footer>
  );
}
