import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "Define NEXT_PUBLIC_SANITY_PROJECT_ID en `.env.local` (o en Vercel). Crea un proyecto en https://www.sanity.io/manage",
  );
}

export default defineConfig({
  name: "redshell",
  title: "Redshell — CMS",
  projectId,
  dataset,
  // Releases activo por defecto en Studio ≥3.75 provoca el aviso «Cannot create a published document»
  // al crear posts en perspectiva Published; para un blog simple usamos flujo clásico draft → publish.
  releases: { enabled: false },
  // Mismo patrón que `Sexologia Content/blog` (Vínculo consciente): structureTool + vision,
  // sin `name` en el tool; `structure` solo personaliza la lista lateral.
  plugins: [structureTool({ title: "CMS", structure }), visionTool()],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
