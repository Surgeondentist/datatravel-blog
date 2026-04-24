import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Error de acceso", robots: { index: false } };

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; detail?: string; oauth_code?: string }>;
}) {
  const { reason, detail, oauth_code: oauthCode } = await searchParams;
  const rateLimited = reason === "rate_limit";
  const missingCode = reason === "missing_code";
  const oauthFail = reason === "oauth";
  const exchangeFail = reason === "exchange";

  let message =
    "Algo falló al iniciar sesión. Prueba de nuevo o contacta si el problema continúa.";
  if (rateLimited) {
    message = "Se alcanzó el límite de intentos desde esta red. Espera unos minutos y vuelve a intentarlo.";
  } else if (missingCode) {
    message =
      "No llegó el código de autorización. Revisa en Google Cloud que la URI de redirección sea la de Supabase (…/auth/v1/callback) y en Supabase las URLs permitidas incluyan /auth/callback.";
  } else if (oauthFail || exchangeFail) {
    message =
      oauthFail
        ? "Google o Supabase rechazaron la petición de acceso. Detalle técnico abajo (útil para corregir la configuración)."
        : "No se pudo crear la sesión. Revisa que el proveedor Google esté activo en Supabase y que Client ID/Secret coincidan con Google Cloud.";
  }

  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground">No se pudo completar el acceso</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{message}</p>
      {(detail || oauthCode) && (
        <pre className="mt-6 overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-left text-xs text-muted-foreground break-words whitespace-pre-wrap">
          {oauthCode ? `${oauthCode}\n` : ""}
          {detail ?? ""}
        </pre>
      )}
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-primary hover:underline">
        Volver al inicio
      </Link>
    </main>
  );
}
