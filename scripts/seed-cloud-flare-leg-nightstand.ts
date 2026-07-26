/**
 * Seeds the "Cloud Flare-Leg Nightstand" — the boxy 2-drawer nightstand with
 * black bar pulls and flared brass legs shown alongside the Cloud Boucle Bed
 * in the Cloud Bubble Bedroom Set photos. Sold single or as a pair, in the
 * same 10-color range plus Black. New standalone product, doesn't touch any
 * other seed file. Run:
 *   npx tsx scripts/seed-cloud-flare-leg-nightstand.ts
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

async function uploadImage(filename: string) {
  const raw = readFileSync(`${GENERATED_ROOT}/${filename}`)
  const watermarked = await watermarkImage(raw)
  const asset = await client.assets.upload("image", watermarked, {
    filename: `cloud-flare-leg-nightstand-${filename.replace(/[()]/g, "").replace(/\s+/g, "-").toLowerCase()}`,
  })
  return asset._id
}

async function finishImagesField(filenames: string[]) {
  return Promise.all(
    filenames.map(async (f, i) => {
      const assetId = await uploadImage(f)
      return { _type: "image", _key: `img${i + 1}`, asset: { _type: "reference", _ref: assetId } }
    })
  )
}

// Same file, viewed once each — confirmed by eye before writing this script.
const FINISHES: { name: string; files: string[] }[] = [
  { name: "Black",         files: ["sidetable (1).png"] },
  { name: "White",         files: ["sidetable (2).png", "sidetable (5).png"] },
  { name: "Light Blue",    files: ["sidetable (3).png"] },
  { name: "Pink",          files: ["sidetable (4).png"] },
  { name: "Dark Grey",     files: ["sidetable (6).png"] },
  { name: "Rust",          files: ["sidetable (7).png"] },
  { name: "Olive Green",   files: ["sidetable (8).png"] },
  { name: "Emerald Green", files: ["sidetable (9).png"] },
  { name: "Light Grey",    files: ["sidetable (10).png"] },
  { name: "Dark Blue",     files: ["sidetable (11).png"] },
]

async function main() {
  const finishes = await Promise.all(
    FINISHES.map(async (f, i) => ({
      _key: `f${i + 1}`,
      name: f.name,
      priceModifier: 0,
      images: await finishImagesField(f.files),
    }))
  )

  const result = await client.createOrReplace({
    _type: "product",
    _id: "product-cloud-flare-leg-nightstand",
    name: "Cloud Flare-Leg Nightstand",
    slug: { current: "cloud-flare-leg-nightstand" },
    category: { _type: "reference", _ref: "category-side-tables" },
    images: finishes[0]!.images,
    basePrice: 16000,
    sku: "NST-CFL-01",
    stockCount: 10,
    inStock: true,
    featured: false,
    material: "16mm Lasani MDF frame with leather-look upholstery and flared brass legs",
    description: "Boxy two-drawer nightstand with black bar pulls and flared brass legs — the matching side table for the Cloud Bubble Bedroom Set. Available single or as a matching pair.",
    careInstructions: "Wipe with a dry or slightly damp cloth. Avoid moisture.",
    tags: ["nightstand", "nightstand pair", "side table", "side table pair", "flared leg nightstand", "bedroom furniture"],
    dimensions: { width: "", height: "", depth: "", unit: "in" },
    finishes,
    variants: [
      { _key: "v1", size: "Single", priceModifier: 0 },
      { _key: "v2", size: "Pair",   priceModifier: 13000 },
    ],
  })

  console.log(`✓ Created ${result._id} — 10 finishes, Single Rs 16,000 / Pair Rs 29,000`)
}

main().catch((err) => { console.error(err); process.exit(1) })
