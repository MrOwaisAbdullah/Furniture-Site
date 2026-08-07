import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:    false,
  token:     process.env.SANITY_API_WRITE_TOKEN!,
})

async function main() {
  const products = await client.fetch(
    `*[_type == "product" && slug.current in ["cloud-flare-leg-nightstand","backlit-round-vanity","arch-cabinet-vanity","glass-niche-wardrobe","cloud-mirror-vanity","oval-vanity","two-tone-panel-nightstand","ring-pull-dresser","ring-pull-nightstand","marlow-channel-bed","monte-channel-bed","two-tone-panel-bed","velvet-arch-vanity","glow-shelf-nightstand","x-door-console","arched-fluted-nightstand","marble-top-ribbed-nightstand-paired","marble-top-ribbed-nightstand-round","channel-storage-bench"]]{name, slug, "finishes": finishes[]{name, "imgs": count(images), "imgNames": images[]{"orig": asset->originalFilename}}}`
  )
  for (const p of products.sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)))) {
    console.log(`\n=== ${p.name} (${p.slug.current}) ===`)
    for (const f of p.finishes ?? []) {
      const names = (f.imgNames ?? []).map((i: any) => i.orig).join(", ")
      console.log(`  ${f.name}: ${f.imgs ?? 0} imgs → ${names}`)
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
