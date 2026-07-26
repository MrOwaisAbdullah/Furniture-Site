/**
 * Adds 7 new color finishes to the existing Channel Storage Bench product
 * (was Light Blue only). Targeted update — does NOT touch any other
 * product, so it doesn't re-upload/re-watermark images that haven't
 * changed. Run:
 *   node_modules/.bin/tsx scripts/update-channel-storage-bench-colors.ts
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

async function uploadImage(relativePath: string) {
  const raw = readFileSync(`${GENERATED_ROOT}/${relativePath}`)
  const watermarked = await watermarkImage(raw)
  const filename = relativePath.split("/").pop()!
  const asset = await client.assets.upload("image", watermarked, { filename })
  return asset._id
}

async function imageField(relativePath: string, key: string) {
  const assetId = await uploadImage(relativePath)
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: assetId } }
}

const NEW_FINISHES: { name: string; image: string }[] = [
  { name: "Beige",         image: "Channel Storage Bench/channel-storage-bench-beige-storage-bench.png" },
  { name: "Emerald Green", image: "Channel Storage Bench/channel-storage-bench-green-storage-bench.png" },
  { name: "Dark Grey",     image: "Channel Storage Bench/channel-storage-bench-grey-storage-bench.png" },
  { name: "Olive Green",   image: "Channel Storage Bench/channel-storage-bench-olive-green-storage-bench.png" },
  { name: "Pink",          image: "Channel Storage Bench/channel-storage-bench-pink-storage-bench.png" },
  { name: "Rust",          image: "Channel Storage Bench/channel-storage-bench-rust-storage-bench.png" },
  { name: "White",         image: "Channel Storage Bench/channel-storage-bench-white-storage-bench.png" },
]

async function main() {
  const existing = await client.fetch<{ finishes: { _key: string; name: string }[] } | null>(
    `*[_id == "product-channel-storage-bench"][0]{ finishes }`
  )
  if (!existing) throw new Error("product-channel-storage-bench not found")

  const startIndex = existing.finishes.length
  console.log(`Existing finishes: ${existing.finishes.map((f) => f.name).join(", ")}`)

  const newFinishDocs = await Promise.all(
    NEW_FINISHES.map(async (f, i) => ({
      _key: `f${startIndex + i + 1}`,
      name: f.name,
      priceModifier: 0,
      images: [await imageField(f.image, "img1")],
    }))
  )

  await client
    .patch("product-channel-storage-bench")
    .setIfMissing({ finishes: [] })
    .append("finishes", newFinishDocs)
    .commit()

  console.log(`✓ Added ${newFinishDocs.length} finishes: ${newFinishDocs.map((f) => f.name).join(", ")}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
