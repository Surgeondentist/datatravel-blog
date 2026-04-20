import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Error de acceso", robots: { index: false } };

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const rateLimited = reason === "rate_limit";

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground">No se pudo completar el acceso</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {rateLimited
          ? "Se alcanzó el límite de intentos desde esta red. Espera unos minutos y vuelve a intentarlo."
          : "Algo falló al iniciar sesión. Prueba de nuevo o contacta si el problema continúa."}
      </p>
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">
        Volver al inicio
      </Link>
    </main>
  );
}
