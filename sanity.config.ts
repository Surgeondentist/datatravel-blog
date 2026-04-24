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
  name: "blogtech",
  title: "Blogtech — CMS",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
