import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

export default defineConfig({
  name: "redshell",
  title: "Redshell — CMS",
  projectId: "l2dq4e3s",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
  basePath: "/studio",
});
