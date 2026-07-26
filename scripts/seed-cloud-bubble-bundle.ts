/**
 * Adds the 10 new "Cloud Bubble Bed Set" room photos as color variants on
 * the 3 real products they show (Cloud Boucle Bed, Cloud Mirror Vanity,
 * Glass Niche Wardrobe), then creates a `bundle` document referencing all
 * three so the set is sellable as one discounted unit on /sets. The 2
 * gold-pedestal nightstands and the stool shown in the photos are NOT
 * separate products — they're a bonus included with the bundle purchase,
 * called out in the description only.
 *
 * These are full-room lifestyle photos, not isolated product shots — no
 * cropped per-product photography exists yet for these 10 colors, so each
 * new finish entry uses the same room photo (only correct data available).
 *
 * Targeted update — does not touch any other product. Run:
 *   npx tsx scripts/seed-cloud-bubble-bundle.ts
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

const FOLDER = "Cloud Bubble Bed Set"

// Sanity finish name -> local filename, mapped to the closest existing
// FINISH_COLOR_PALETTE entry (Navy-Blue.png -> "Dark Blue", already in the
// palette, avoids adding a near-duplicate color).
const COLORS: { name: string; file: string }[] = [
  { name: "White",         file: "offwhite.png" },
  { name: "Beige",         file: "beige.png" },
  { name: "Dark Grey",     file: "dark-grey.png" },
  { name: "Dark Blue",     file: "Navy-Blue.png" },
  { name: "Emerald Green", file: "emarald-green.png" },
  { name: "Light Blue",    file: "light-blue.png" },
  { name: "Light Grey",    file: "light-grey.png" },
  { name: "Olive Green",   file: "olive-green.png" },
  { name: "Pink",          file: "Pink.png" },
  { name: "Rust",          file: "Rust.png" },
]

const uploadedAssetIds = new Map<string, string>()

async function uploadColorImage(colorName: string, file: string) {
  const cached = uploadedAssetIds.get(colorName)
  if (cached) return cached
  const raw = readFileSync(`${GENERATED_ROOT}/${FOLDER}/${file}`)
  const watermarked = await watermarkImage(raw)
  const asset = await client.assets.upload("image", watermarked, {
    filename: `cloud-bubble-bedroom-set-${colorName.toLowerCase().replace(/\s+/g, "-")}-full-set.png`,
  })
  uploadedAssetIds.set(colorName, asset._id)
  return asset._id
}

async function imageField(assetId: string, key: string) {
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: assetId } }
}

/** Appends a finish for every color the product doesn't already have. */
async function addMissingFinishes(productId: string, existingNames: Set<string>) {
  const missing = COLORS.filter((c) => !existingNames.has(c.name))
  if (missing.length === 0) {
    console.log(`  ${productId}: already has every color, nothing to add`)
    return
  }

  const newFinishes = await Promise.all(
    missing.map(async (c, i) => {
      const assetId = await uploadColorImage(c.name, c.file)
      return {
        _key: `cbb${i + 1}`,
        name: c.name,
        priceModifier: 0,
        images: [await imageField(assetId, "img1")],
      }
    })
  )

  await client.patch(productId).append("finishes", newFinishes).commit()
  console.log(`  ${productId}: added ${missing.length} finishes (${missing.map((m) => m.name).join(", ")})`)
}

async function main() {
  console.log("Adding color variants to the 3 real products in the set...")
  await addMissingFinishes("product-cloud-boucle-bed", new Set(["White"]))
  await addMissingFinishes("product-cloud-mirror-vanity", new Set(["White"]))
  await addMissingFinishes("product-glass-niche-wardrobe", new Set(["Gray", "Beige", "Black", "Blue", "Terracotta"]))

  console.log("Creating bundle document...")
  const coverAssetId = await uploadColorImage("White", "offwhite.png")
  const bundle = await client.createOrReplace({
    _id: "bundle-cloud-bubble-bedroom-set",
    _type: "bundle",
    name: "Cloud Bubble Bedroom Set",
    slug: { _type: "slug", current: "cloud-bubble-bedroom-set" },
    description:
      "The Cloud Bubble bed, Cloud Mirror dressing table, Glass Niche wardrobe, and a pair of Cloud Flare-Leg nightstands — together as one styled room, in 10 matching colors. Buy the set and we include a matching bubble stool free, not sold separately.",
    image: { _type: "image", asset: { _type: "reference", _ref: coverAssetId } },
    products: [
      { _type: "reference", _key: "p1", _ref: "product-cloud-boucle-bed" },
      { _type: "reference", _key: "p2", _ref: "product-cloud-mirror-vanity" },
      { _type: "reference", _key: "p3", _ref: "product-glass-niche-wardrobe" },
      { _type: "reference", _key: "p4", _ref: "product-cloud-flare-leg-nightstand" },
    ],
    finishNames: COLORS.map((c) => c.name),
    bundlePrice: 220000,
    variantOverrides: [
      { _type: "object", _key: "v1", product: { _type: "reference", _ref: "product-cloud-flare-leg-nightstand" }, variantSize: "Pair" },
    ],
    active: true,
  })
  console.log(`✓ Created ${bundle._id}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
