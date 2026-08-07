/**
 * Renames the Shaadi package to "Shaadi / Jahez Bedroom Set" and rebuilds
 * its finishes with same-color piece photos (bed + dressing table +
 * side table + wardrobe) from D:\Furniture\Generated, per owner decisions:
 *   - 8 finishes: Brown, White, Light Grey, Beige, Dark Grey, Pink,
 *     Emerald Green, Light Blue
 *   - Each finish shows DIFFERENT pieces in the same color (not the same
 *     bed repeated)
 *   - Where no dedicated piece photo exists (emerald/light-blue dressing,
 *     emerald wardrobe) the Cloud Mirror Vanity room shot (already
 *     uploaded, watermarked) is reused
 *   - Brown wardrobe uses the rust Glass Niche Wardrobe photo
 * Stays a `product` (sets have no per-variant images). Run:
 *   npx tsx scripts/update-shaadi-jahez-set.ts
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"
import { existsSync, readFileSync } from "fs"
import { watermarkImage } from "./lib/watermark"
import { GENERATED_ROOT } from "./lib/paths"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:    false,
  token:     process.env.SANITY_API_WRITE_TOKEN!,
})

async function uploadImage(relPath: string, key: string) {
  const full = `${GENERATED_ROOT}/${relPath}`
  if (!existsSync(full)) {
    console.warn(`  SKIP missing: ${relPath}`)
    return null
  }
  const raw = readFileSync(full)
  const watermarked = await watermarkImage(raw)
  const asset = await client.assets.upload("image", watermarked, {
    filename: `shaadi-jahez-bedroom-set-${key}.png`,
  })
  return asset._id
}

async function imageField(relPath: string, key: string, i: number) {
  const assetId = await uploadImage(relPath, key)
  if (!assetId) return null
  return { _type: "image", _key: `img${i + 1}`, asset: { _type: "reference", _ref: assetId } }
}

/** Asset refs of the Cloud Mirror Vanity room-shot finishes (already watermarked). */
async function existingRoomShotImages(finishName: string) {
  const doc = await client.fetch(
    `*[_id == "product-cloud-mirror-vanity"]{"finishes": finishes[name == $name]}`,
    { name: finishName }
  )
  const finish = doc?.[0]?.finishes?.[0]
  if (!finish || !finish.images?.length) throw new Error(`No Cloud Mirror "${finishName}" room shot found`)
  return finish.images
}

type Piece = { folder: string; file: string } | { reuseFinish: string }

async function pieceImages(pieces: (Piece | string)[]) {
  const out: any[] = []
  for (const p of pieces) {
    if (typeof p === "string") {
      const reuse = await existingRoomShotImages(p)
      for (const img of reuse) out.push(img)
    } else {
      const field = await imageField(`${p.folder}/${p.file}`, out.length + 1, out.length)
      if (field) out.push(field)
    }
  }
  return out
}

// finish name -> pieces. Strings = reuse Cloud Mirror room-shot finish
// (already uploaded/watermarked). Objects = upload from folder.
const FINISHES: { name: string; pieces: (Piece | string)[] }[] = [
  {
    name: "Brown",
    pieces: [
      { folder: "Two-Tone Panel Bed", file: "two-tone-panel-bed-brown-king-size-bed-1.png" },
      { folder: "Ring-Pull Dresser", file: "ring-pull-dresser-brown-dresser-1.png" },
      { folder: "Ring-Pull Dresser", file: "ring-pull-dresser-brown-dresser-2.png" },
      { folder: "Ring-Pull Nightstand", file: "ring-pull-nightstand-brown-nightstand-1.png" },
      { folder: "Glass Niche Wardrobe", file: "glass-niche-wardrobe-rust-wardrobe-1.png" },
    ],
  },
  {
    name: "White",
    pieces: [
      { folder: "Marlow Channel Bed", file: "White (1).png" },
      { folder: "Marlow Channel Bed", file: "White (2).png" },
      { folder: "Marlow Channel Bed", file: "White (3).png" },
      { folder: "Oval Vanity", file: "oval-vanity-offwhite-vanity-set-1.png" },
      { folder: "Oval Vanity", file: "oval-vanity-offwhite-vanity-set-2.png" },
      { folder: "Two-Tone Panel Nightstand", file: "two-tone-panel-nightstand-white-nightstand-1.png" },
      { folder: "Glass Niche Wardrobe", file: "glass-niche-wardrobe-white-wardrobe.png" },
    ],
  },
  {
    name: "Light Grey",
    pieces: [
      { folder: "Monte Channel Bed", file: "light-grey.png" },
      { folder: "Velvet Arch Vanity", file: "velvet-arch-vanity-gray-vanity-set-1.png" },
      { folder: "Velvet Arch Vanity", file: "velvet-arch-vanity-gray-vanity-set-2.png" },
      { folder: "Glow Shelf Nightstand", file: "glow-shelf-nightstand-gray-nightstand-1.png" },
      { folder: "Glass Niche Wardrobe", file: "glass-niche-wardrobe-gray-wardrobe-1.png" },
    ],
  },
  {
    name: "Beige",
    pieces: [
      { folder: "Two-Tone Panel Bed", file: "two-tone-panel-bed-beige-king-size-bed-1.png" },
      { folder: "Arch Cabinet Vanity", file: "arch-cabinet-vanity-beige-vanity-set-3.png" },
      { folder: "Marble-Top Ribbed Nightstand (Paired)", file: "marble-top-ribbed-nightstand-paired-beige-nightstand-pair-1.png" },
      { folder: "Glass Niche Wardrobe", file: "glass-niche-wardrobe-beige-wardrobe-1.png" },
    ],
  },
  {
    name: "Dark Grey",
    pieces: [
      { folder: "Monte Channel Bed", file: "dark-grey.png" },
      { folder: "X-Door Console", file: "x-door-console-dark-grey-console-table-1.png" },
      { folder: "X-Door Console", file: "x-door-console-dark-grey-console-table-2.png" },
      { folder: "Arched Fluted Nightstand", file: "arched-fluted-nightstand-dark-grey-nightstand-1.png" },
      { folder: "Glass Niche Wardrobe", file: "glass-niche-wardrobe-gray-wardrobe-1.png" },
    ],
  },
  {
    name: "Pink",
    pieces: [
      { folder: "Monte Channel Bed", file: "pink.png" },
      { folder: "Backlit Round Vanity", file: "backlit-round-vanity-pink-vanity-set-7.png" },
      { folder: "Cloud Flare-Leg Nightstand", file: "pink.png" },
      { folder: "Glass Niche Wardrobe", file: "glass-niche-wardrobe-pink-wardrobe-1.png" },
    ],
  },
  {
    name: "Emerald Green",
    pieces: [
      { folder: "Monte Channel Bed", file: "Emarald-Green.png" },
      "Emerald Green", // dressing — Cloud Mirror room shot
      { folder: "Cloud Flare-Leg Nightstand", file: "emarald-green.png" },
      "Emerald Green", // wardrobe — Cloud Mirror room shot
    ],
  },
  {
    name: "Light Blue",
    pieces: [
      { folder: "Monte Channel Bed", file: "light-blue.png" },
      "Light Blue", // dressing — Cloud Mirror room shot
      { folder: "Cloud Flare-Leg Nightstand", file: "light-blue.png" },
      { folder: "Glass Niche Wardrobe", file: "glass-niche-wardrobe-light-blue-wardrobe-1.png" },
    ],
  },
]

async function main() {
  const finishes = await Promise.all(
    FINISHES.map(async (f, i) => ({
      _key: `f${i + 1}`,
      name: f.name,
      priceModifier: 0,
      images: await pieceImages(f.pieces),
    }))
  )

  const result = await client.patch("product-full-bedroom-set").set({ finishes, name: "Shaadi / Jahez Bedroom Set" }).commit()

  console.log(`✓ ${result._id} → "${result.name}" — ${finishes.length} finishes`)
  for (const f of finishes) console.log(`  ${f.name}: ${f.images.length} imgs`)
}

main().catch((err) => { console.error(err); process.exit(1) })
