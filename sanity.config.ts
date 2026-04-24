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
  plugins: [
    // No uses `name` personalizado aquí: rompe el router embebido (NextStudio) con
    // "Could not map state keys: tool, cms". El segmento URL por defecto es "structure".
    structureTool({
      title: "CMS",
      structure,
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
