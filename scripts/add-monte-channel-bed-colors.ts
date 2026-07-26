/**
 * Adds 9 new colors to Monte Channel Bed (its original "Brown" finish was
 * already renamed to "Rust" directly in Sanity Studio — same cognac leather
 * photos, just relabeled to match the standard 10-color naming, so Rust is
 * NOT re-added here to avoid a duplicate). Matches the same 10-color range
 * used across Cloud Bubble Bedroom Set and Cloud Flare-Leg Nightstand.
 * Targeted patch — appends finishes only, doesn't touch the renamed finish
 * or any other product. Run:
 *   npx tsx scripts/add-monte-channel-bed-colors.ts
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

const FOLDER = "Monte Channel Bed"

async function uploadImage(filename: string) {
  const raw = readFileSync(`${GENERATED_ROOT}/${FOLDER}/${filename}`)
  const watermarked = await watermarkImage(raw)
  const asset = await client.assets.upload("image", watermarked, {
    filename: `monte-channel-bed-${filename.replace(/[()]/g, "").replace(/\s+/g, "-").toLowerCase()}`,
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

const NEW_FINISHES: { name: string; files: string[] }[] = [
  { name: "Emerald Green", files: ["Emarald-Green.png"] },
  { name: "Beige",         files: ["beige.png"] },
  { name: "Black",         files: ["black.png"] },
  { name: "Dark Grey",     files: ["dark-grey.png"] },
  { name: "Light Blue",    files: ["light-blue.png"] },
  { name: "Light Grey",    files: ["light-grey.png"] },
  { name: "Dark Blue",     files: ["navy-blue.png"] },
  { name: "Olive Green",   files: ["olive-green.png"] },
  { name: "Pink",          files: ["pink.png"] },
  { name: "White",         files: ["white.png"] },
]

async function main() {
  const newFinishes = await Promise.all(
    NEW_FINISHES.map(async (f, i) => ({
      _key: `mcb${i + 1}`,
      name: f.name,
      priceModifier: 0,
      images: await finishImagesField(f.files),
    }))
  )

  await client.patch("product-monte-channel-bed").append("finishes", newFinishes).commit()
  console.log(`✓ Added ${newFinishes.length} finishes to product-monte-channel-bed (${NEW_FINISHES.map((f) => f.name).join(", ")})`)
}

main().catch((err) => { console.error(err); process.exit(1) })
