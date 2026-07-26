/**
 * Glass Niche Wardrobe's "Beige" finish has always pointed at a wrongly
 * generated image (shows a light-blue wardrobe, not beige) — a pre-existing
 * data bug from the wardrobe's original 5-color seed, surfaced by the new
 * Cloud Bubble Bedroom Set bundle. Fixes it by reusing the correctly-colored
 * beige room photo already uploaded for Cloud Boucle Bed's own "Beige"
 * finish (same asset, no re-upload). Targeted — touches only this one
 * finish's image on this one product. Run:
 *   npx tsx scripts/fix-glass-niche-wardrobe-beige.ts
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

const CORRECT_BEIGE_ASSET_ID = "image-68dcd48e4ad4b8ae9c2703b8afaf2c28ee29f3c7-1315x1093-png"

async function main() {
  const product = await client.fetch<{ finishes: { _key: string; name: string }[] } | null>(
    `*[_id == "product-glass-niche-wardrobe"][0]{ finishes[]{_key, name} }`
  )
  const beige = product?.finishes.find((f) => f.name === "Beige")
  if (!beige) throw new Error("No Beige finish found on product-glass-niche-wardrobe")

  await client
    .patch("product-glass-niche-wardrobe")
    .set({
      [`finishes[_key=="${beige._key}"].images`]: [
        { _type: "image", _key: "img1", asset: { _type: "reference", _ref: CORRECT_BEIGE_ASSET_ID } },
      ],
    })
    .commit()

  console.log(`✓ Fixed Beige finish (${beige._key}) image on product-glass-niche-wardrobe`)
}

main().catch((err) => { console.error(err); process.exit(1) })
