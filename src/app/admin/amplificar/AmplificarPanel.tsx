"use client";

import { useState } from "react";
import { Hash, Mail, Play, Copy, Check, Loader2 } from "lucide-react";
import { generarContenido, type Formato } from "@/app/actions/amplificar";

type Post = { _id: string; title: string; slug: { current: string } };

const formatos: { id: Formato; label: string; icon: React.ElementType; descripcion: string }[] = [
  { id: "twitter",     label: "Hilo de Twitter/X",   icon: Hash,    descripcion: "6-10 tuits optimizados" },
  { id: "newsletter",  label: "Email newsletter",     icon: Mail,    descripcion: "Email de promoción" },
  { id: "reels",       label: "Guion de Reels",       icon: Play,    descripcion: "60-90 segundos" },
];

export default function AmplificarPanel({ posts }: { posts: Post[] }) {
  const [slug, setSlug] = useState("");
  const [cargando, setCargando] = useState<Formato | null>(null);
  const [resultado, setResultado] = useState("");
  const [error, setError] = useState("");
  const [copiado, setCopiado] = useState(false);

  async function generar(formato: Formato) {
    if (!slug) { setError("Selecciona un artículo primero"); return; }
    setError("");
    setResultado("");
    setCargando(formato);

    const res = await generarContenido(slug, formato);
    setCargando(null);

    if ("error" in res) { setError(res.error); return; }
    setResultado(res.contenido);
  }

  async function copiar() {
    await navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-lg font-bold text-foreground">Distribución y amplificación</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona un artículo y genera contenido listo para publicar en redes o newsletter.
        </p>
      </div>

      {/* Selector de artículo */}
      <div className="space-y-2">
        <label htmlFor="post-select" className="text-sm font-medium text-foreground">
          Artículo
        </label>
        <select
          id="post-select"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setResultado(""); setError(""); }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">— Selecciona un artículo —</option>
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

      {/* Resultado */}
      {resultado && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Resultado</span>
            <button
              onClick={copiar}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {copiado ? (
                <><Check className="h-3.5 w-3.5 text-green-500" /> Copiado</>
              ) : (
                <><Copy className="h-3.5 w-3.5" /> Copiar</>
              )}
            </button>
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
