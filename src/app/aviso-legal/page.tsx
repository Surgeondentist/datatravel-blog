import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal del sitio Redshell.",
  alternates: { canonical: "/aviso-legal" },
  robots: { index: true, follow: true },
};

export default function AvisoLegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        Aviso legal
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Aviso legal</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-p:text-muted-foreground prose-headings:text-foreground">
        <p>
          El titular del sitio pone a disposición esta web con fines informativos. El contenido no constituye, salvo
          que se indique expresamente, asesoramiento profesional, médico, legal ni de seguridad.
        </p>
        <p>
          Los enlaces a terceros se ofrecen por conveniencia; no se responde del contenido ajeno. Las marcas y
          nombres comerciales citados pueden pertenecer a sus respectivos titulares.
        </p>
        <p className="text-sm">
          Texto orientativo; complétalo con datos identificativos, legislación y contacto según tu país y actividad.
        </p>
      </div>
    </main>
  );
}
