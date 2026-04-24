import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineCliConfig({
  api: projectId
    ? { projectId, dataset }
    : { projectId: "missing-env", dataset: "production" },
  studioHost: "blogtech",
});
