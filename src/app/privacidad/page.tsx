import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Información sobre tratamiento de datos en Redshell.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        Privacidad
      </p>
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">Política de privacidad</h1>
      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-p:text-muted-foreground prose-headings:text-foreground">
        <p>
          Este sitio puede utilizar proveedores técnicos (alojamiento, analítica, publicidad, autenticación y CMS)
          bajo sus propias políticas. Los datos que envíes por formularios (por ejemplo, boletín o comentarios) se
          usarán solo para esa finalidad.
        </p>
        <p>
          Puedes solicitar acceso, rectificación o supresión cuando la ley aplicable lo permita, contactando a
          través de los medios publicados en el sitio.
        </p>
        <p className="text-sm">
          Texto orientativo; revísalo con asesoría legal antes de considerarlo definitivo para tu jurisdicción.
        </p>
      </div>
    </main>
  );
}
