/**
 * Merges the two separate Marble-Top Ribbed Nightstand products (Round +
 * Paired, same physical design, just different marketing splits) into one
 * product with Single/Pair variants, matching the pattern already used by
 * every other nightstand in the catalog (NIGHTSTAND_VARIANTS). Patches only
 * the Round product's finish images/variants — does not touch other
 * products' images. Run:
 *   node_modules/.bin/tsx scripts/merge-marble-nightstand-variants.ts
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"
import { readFileSync } from "fs"
import { watermarkImage } from "./lib/watermark"
import { GENERATED_ROOT } from "./lib/paths"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:    false,
  token:     process.env.SANITY_API_WRITE_TOKEN!,
})

async function imageField(relativePath: string, key: string) {
  const raw = readFileSync(`${GENERATED_ROOT}/${relativePath}`)
  const watermarked = await watermarkImage(raw)
  const filename = relativePath.split("/").pop()!
  const asset = await client.assets.upload("image", watermarked, { filename })
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: asset._id } }
}

async function main() {
  const pairedImages = await Promise.all(
    [1, 2].map((i, idx) =>
      imageField(
        `Marble-Top Ribbed Nightstand (Paired)/marble-top-ribbed-nightstand-paired-beige-nightstand-pair-${i}.png`,
        `imgP${idx + 1}`
      )
    )
  )

  const result = await client
    .patch("product-marble-top-ribbed-nightstand-round")
    .set({
      description: "Ribbed nightstand with a marble-look top, gold trim, brass bar pull, and tapered gold legs — symmetric on both sides, so it works on either side of the bed. Available single or as a matching pair.",
      tags: ["nightstand", "nightstand pair", "side table", "side table pair", "marble top nightstand", "ribbed nightstand", "bedside table", "bedroom furniture"],
      variants: [
        { _key: "v1", size: "Single", priceModifier: 0 },
        { _key: "v2", size: "Pair",   priceModifier: 12000 },
      ],
    })
    .append("finishes[0].images", pairedImages)
    .commit()

  console.log(`✓ Updated ${result._id} — Single/Pair variants + merged in 2 photos from the Paired folder`)

  await client.delete("product-marble-top-ribbed-nightstand-paired")
  console.log("✓ Deleted product-marble-top-ribbed-nightstand-paired (merged into Round)")
}

main().catch((err) => { console.error(err); process.exit(1) })
