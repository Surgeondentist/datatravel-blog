"use client";

import { useState } from "react";
import { Hash, Mail, Play, Copy, Check, Loader2, Send } from "lucide-react";
import { generarContenido, type Formato } from "@/app/actions/amplificar";
import { enviarNewsletter } from "@/app/actions/newsletter-send";

type Post = { _id: string; title: string; slug: { current: string } };

const formatos: { id: Formato; label: string; icon: React.ElementType; descripcion: string }[] = [
  { id: "twitter", label: "Twitter/X thread", icon: Hash, descripcion: "6–10 optimized tweets" },
  { id: "newsletter", label: "Newsletter email", icon: Mail, descripcion: "Promo email draft" },
  { id: "reels", label: "Reels script", icon: Play, descripcion: "60–90 seconds" },
];

export default function AmplificarPanel({ posts }: { posts: Post[] }) {
  const [slug, setSlug] = useState("");
  const [cargando, setCargando] = useState<Formato | null>(null);
  const [resultado, setResultado] = useState("");
  const [formatoActivo, setFormatoActivo] = useState<Formato | null>(null);
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [envioOk, setEnvioOk] = useState<string | null>(null);

  async function generar(formato: Formato) {
    if (!slug) { setError("Select a post first"); return; }
    setError("");
    setResultado("");
    setEnvioOk(null);
    setCargando(formato);

    const res = await generarContenido(slug, formato);
    setCargando(null);

    if ("error" in res) { setError(res.error); return; }
    setResultado(res.content);
    setFormatoActivo(formato);
  }

  async function enviar() {
    if (!resultado) return;
    setEnviando(true);
    setError("");
    setEnvioOk(null);

    // Extract subject from the generated content (first **Subject:** line)
    const subjectMatch = resultado.match(/\*\*Subject:\*\*\s*(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : "New post on Redshell";
    const html = resultado.replace(/\n/g, "<br>");

    const res = await enviarNewsletter(subject, html);
    setEnviando(false);

    if ("error" in res) { setError(res.error); return; }
    setEnvioOk(`Sent to ${res.sent} subscriber${res.sent !== 1 ? "s" : ""}`);
  }

  async function copiar() {
    await navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-foreground">Distribution & amplification</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a post and generate copy ready for social or your newsletter.
        </p>
      </div>

      {/* Post selector */}
      <div className="space-y-2">
        <label htmlFor="post-select" className="text-sm font-medium text-foreground">
          Post
        </label>
        <select
          id="post-select"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setResultado(""); setError(""); }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">— Select a post —</option>
          {posts.map((p) => (
            <option key={p._id} value={p.slug.current}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Botones de formato */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {formatos.map(({ id, label, icon: Icon, descripcion }) => (
          <button
            key={id}
            onClick={() => generar(id)}
            disabled={!!cargando}
            className="flex flex-col items-start gap-1 rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center gap-2 font-medium text-foreground">
              {cargando === id ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Icon className="h-4 w-4 text-primary" />
              )}
              {label}
            </span>
            <span className="text-xs text-muted-foreground">{descripcion}</span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Envío OK */}
      {envioOk && (
        <p className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          {envioOk}
        </p>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Output</span>
            <div className="flex items-center gap-2">
              {formatoActivo === "newsletter" && (
                <button
                  onClick={enviar}
                  disabled={enviando}
                  className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {enviando ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="h-3.5 w-3.5" /> Send to subscribers</>
                  )}
                </button>
              )}
              <button
                onClick={copiar}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {copiado ? (
                  <><Check className="h-3.5 w-3.5 text-green-500" /> Copied</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> Copy</>
                )}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={resultado}
            rows={20}
            className="w-full rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm text-foreground focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
