/**
 * Adds the newly-seeded Cloud Flare-Leg Nightstand to the Cloud Bubble
 * Bedroom Set bundle as its Pair variant (matching the 2 side tables shown
 * in the room photos), keeps bundlePrice at Rs 220,000, and updates the
 * description now that the side tables are a real, separately-sellable
 * product (only the stool remains a free bonus). Run:
 *   npx tsx scripts/add-nightstand-to-cloud-bundle.ts
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
  await client
    .patch("bundle-cloud-bubble-bedroom-set")
    .append("products", [{ _type: "reference", _key: "p4", _ref: "product-cloud-flare-leg-nightstand" }])
    .set({
      description:
        "The Cloud Bubble bed, Cloud Mirror dressing table, Glass Niche wardrobe, and a pair of Cloud Flare-Leg nightstands — together as one styled room, in 10 matching colors. Buy the set and we include a matching bubble stool free, not sold separately.",
      variantOverrides: [
        { _type: "object", _key: "v1", product: { _type: "reference", _ref: "product-cloud-flare-leg-nightstand" }, variantSize: "Pair" },
      ],
    })
    .commit()

  console.log("✓ Added Cloud Flare-Leg Nightstand (Pair) to bundle-cloud-bubble-bedroom-set, updated description")
}

main().catch((err) => { console.error(err); process.exit(1) })
