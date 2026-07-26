/**
 * Patches Channel Storage Bench with King/Queen/Single size variants and
 * real dimensions. Targeted update — does NOT touch images, so it doesn't
 * re-upload/re-watermark anything. Run:
 *   node_modules/.bin/tsx scripts/update-channel-storage-bench-sizing.ts
 */
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
  const result = await client
    .patch("product-channel-storage-bench")
    .set({
      description: "Channel-tufted velvet storage bench with slim tapered legs, available in 8 colors. A soft-close storage seat for the end of a bed or living room.",
      dimensions: { width: "72", height: "24", depth: "16", unit: "in" },
      variants: [
        { _key: "v1", size: "King",   priceModifier: 0 },
        { _key: "v2", size: "Queen",  priceModifier: -4000 },
        { _key: "v3", size: "Single", priceModifier: -8000 },
      ],
    })
    .commit()

  console.log(`✓ Updated ${result._id} — dimensions + King/Queen/Single variants`)
}

main().catch((err) => { console.error(err); process.exit(1) })
