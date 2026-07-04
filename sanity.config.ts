import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { schemaTypes } from "./src/schemas"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"

export default defineConfig({
  name: "yousuf-living",
  title: "Yousuf Living",
  basePath: "/admin/content-studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool()],
})
