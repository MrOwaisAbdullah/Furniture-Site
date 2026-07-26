/**
 * Seeds the 9 new bed designs from D:\Furniture\Generated (real AI-generated
 * product photos, organized into per-design folders). Run:
 *   node_modules/.bin/tsx scripts/seed-beds.ts
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in .env.local
 *
 * Uses createOrReplace so this is safe to re-run after fixing a typo/price.
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

const IMG_ROOT = GENERATED_ROOT

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const uploadedAssetIds = new Map<string, string>()

// Uploaded filenames are SEO-relevant (Sanity keeps the original filename in
// the asset URL/metadata) — so instead of the source disk filename, each
// image is uploaded as "<bed-slug>-<finish>-king-size-bed-<n>.png".
async function uploadImage(relativePath: string, seoFilename: string) {
  const cached = uploadedAssetIds.get(relativePath)
  if (cached) return cached
  const raw = readFileSync(`${IMG_ROOT}/${relativePath}`)
  const watermarked = await watermarkImage(raw)
  const asset = await client.assets.upload("image", watermarked, { filename: seoFilename })
  uploadedAssetIds.set(relativePath, asset._id)
  return asset._id
}

async function imageField(relativePath: string, seoFilename: string, key: string) {
  const assetId = await uploadImage(relativePath, seoFilename)
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: assetId } }
}

async function finishImagesField(bedSlug: string, finishName: string, relativePaths: string[]) {
  return Promise.all(
    relativePaths.map((p, i) => {
      const seoFilename = `${bedSlug}-${slugify(finishName)}-king-size-bed-${i + 1}.png`
      return imageField(p, seoFilename, `img${i + 1}`)
    })
  )
}

// King/Queen/Single mattress footprint — same across every bed design.
// Height (headboard) is an estimate per design until real measurements come
// in — flagged in each product's description.
const SIZE_VARIANTS = [
  { _key: "v1", size: "King",   priceModifier: 0 },
  { _key: "v2", size: "Queen",  priceModifier: 0 },
  { _key: "v3", size: "Single", priceModifier: -15000 },
]

const CARE_VELVET = "Vacuum upholstery weekly. Spot clean with a dry or slightly damp cloth. Avoid direct sunlight and moisture."
const CARE_LEATHER = "Wipe with a dry cloth. Avoid direct sunlight and sharp objects."

async function seed() {
  const catMap = { beds: "category-beds" }

  const beds = [
    {
      _id: "product-ashcombe-tufted-bed",
      name: "Ashcombe Tufted Bed",
      slug: "ashcombe-tufted-bed",
      sku: "BED-ASH-01",
      material: "16mm Lasani MDF frame with tufted velvet upholstery",
      care: CARE_VELVET,
      height: "48",
      description:
        "Charcoal grey biscuit-tufted bed with a plush square-tufted headboard, matching footboard, and slim gold blade legs. A modern upholstered king size bed built for a contemporary bedroom.",
      tags: ["tufted bed", "biscuit tufted bed", "king size bed", "grey bed", "modern bedroom", "upholstered bed"],
      finishes: [{ name: "Dark Grey", images: ["Ashcombe Tufted Bed/Dark Grey (1).png", "Ashcombe Tufted Bed/Dark Grey (2).png", "Ashcombe Tufted Bed/Dark Grey (3).png", "Ashcombe Tufted Bed/Dark Grey (4).png"] }],
    },
    {
      _id: "product-marlow-channel-bed",
      name: "Marlow Channel Bed",
      slug: "marlow-channel-bed",
      sku: "BED-MLW-01",
      material: "16mm Lasani MDF frame with velvet upholstery",
      care: CARE_VELVET,
      height: "52",
      description:
        "Ivory velvet bed with tall vertical channel tufting on the headboard and a matching low channel footboard on block legs. A clean, elegant king size bed for a modern bedroom.",
      tags: ["channel tufted bed", "vertical channel bed", "white bed", "velvet bed", "king size bed", "modern bedroom"],
      finishes: [{ name: "White", images: ["Marlow Channel Bed/White (1).png", "Marlow Channel Bed/White (2).png", "Marlow Channel Bed/White (3).png"] }],
    },
    {
      _id: "product-sovereign-led-bed",
      name: "Sovereign LED Bed",
      slug: "sovereign-led-bed",
      sku: "BED-SOV-01",
      material: "16mm Lasani MDF frame with velvet upholstery and a backlit brass filigree inlay",
      care: CARE_VELVET,
      height: "46",
      description:
        "Channel-tufted bed with a glowing brass filigree inlay strip across the headboard. A statement luxury king size bed for a bold modern bedroom, available in 8 colors.",
      tags: ["led bed", "backlit bed", "luxury bed", "king size bed", "modern bedroom", "brass inlay bed"],
      finishes: [
        { name: "Light Blue",    images: ["Sovereign LED Bed/Light Blue (1).png", "Sovereign LED Bed/Light Blue (2).png", "Sovereign LED Bed/Light Blue (3).png"] },
        { name: "Gray",          images: ["Sovereign LED Bed/Gray (1).png", "Sovereign LED Bed/Gray (2).png", "Sovereign LED Bed/Gray (3).png"] },
        { name: "Beige",         images: ["Sovereign LED Bed/Beige (1).png", "Sovereign LED Bed/Beige (2).png"] },
        { name: "Olive Green",   images: ["Sovereign LED Bed/Olive Green.png"] },
        { name: "Pink",          images: ["Sovereign LED Bed/Pink.png"] },
        { name: "Emerald Green", images: ["Sovereign LED Bed/Emerald Green.png"] },
        { name: "Brown",         images: ["Sovereign LED Bed/Brown.png"] },
        { name: "Rust",          images: ["Sovereign LED Bed/Rust.png"] },
      ],
    },
    {
      _id: "product-fantail-shell-bed",
      name: "Fantail Shell Bed",
      slug: "fantail-shell-bed",
      sku: "BED-FAN-01",
      material: "16mm Lasani MDF frame with velvet upholstery",
      care: CARE_VELVET,
      height: "50",
      description:
        "Beige velvet bed with a fan-shaped shell headboard, arched top and vertical channel ribs. A glam king size bed with a soft, rounded silhouette.",
      tags: ["shell headboard bed", "arched bed", "fan headboard bed", "beige bed", "king size bed", "glam bedroom"],
      finishes: [{ name: "Beige", images: ["Fantail Shell Bed/Beige (1).png", "Fantail Shell Bed/Beige (2).png"] }],
    },
    {
      _id: "product-cloud-boucle-bed",
      name: "Cloud Boucle Bed",
      slug: "cloud-boucle-bed",
      sku: "BED-CLB-01",
      material: "16mm Lasani MDF frame with boucle upholstery",
      care: CARE_VELVET,
      height: "47",
      description:
        "Ivory boucle bed with a rounded 'cloud' channel headboard and a matching bubble-channel footboard. A soft, textured king size bed for a cozy modern bedroom.",
      tags: ["boucle bed", "cloud bed", "bubble channel bed", "cream bed", "king size bed", "textured bed"],
      finishes: [{ name: "Offwhite", images: ["Cloud Boucle Bed/Offwhite (1).png", "Cloud Boucle Bed/Offwhite (2).png", "Cloud Boucle Bed/Offwhite (3).png", "Cloud Boucle Bed/Offwhite (4).png"] }],
    },
    {
      _id: "product-column-arch-bed",
      name: "Column Arch Bed",
      slug: "column-arch-bed",
      sku: "BED-COL-01",
      material: "16mm Lasani MDF frame with velvet upholstery",
      care: CARE_VELVET,
      height: "54",
      description:
        "Emerald green velvet bed with a tall arched column headboard and slender brass legs. A rich, statement king size bed for a bold bedroom.",
      tags: ["arched headboard bed", "green bed", "emerald bed", "king size bed", "luxury bedroom"],
      finishes: [{ name: "Emerald Green", images: ["Column Arch Bed/Emerald Green (1).png", "Column Arch Bed/Emerald Green (2).png"] }],
    },
    {
      _id: "product-harlow-tufted-bed",
      name: "Harlow Tufted Bed",
      slug: "harlow-tufted-bed",
      sku: "BED-HAR-01",
      material: "16mm Lasani MDF frame with tufted boucle upholstery",
      care: CARE_VELVET,
      height: "48",
      description:
        "Pink boucle bed with a plush square-tufted headboard and matching footboard. A soft, feminine king size bed for a modern bedroom.",
      tags: ["tufted bed", "biscuit tufted bed", "pink bed", "king size bed", "modern bedroom"],
      finishes: [{ name: "Pink", images: ["Harlow Tufted Bed/Pink (1).png", "Harlow Tufted Bed/Pink (2).png"] }],
    },
    {
      _id: "product-monte-channel-bed",
      name: "Monte Channel Bed",
      slug: "monte-channel-bed",
      sku: "BED-MON-01",
      material: "16mm Lasani MDF frame with PU leather upholstery",
      care: CARE_LEATHER,
      height: "52",
      description:
        "Cognac PU leather bed with narrow vertical channel tufting on the headboard and footboard. A warm, modern king size bed with a tailored leather finish.",
      tags: ["leather bed", "channel tufted bed", "cognac leather bed", "king size bed", "modern bedroom"],
      finishes: [{ name: "Brown", images: ["Monte Channel Bed/Brown (1).png", "Monte Channel Bed/Brown (2).png", "Monte Channel Bed/Brown (3).png"] }],
    },
    {
      _id: "product-twin-arch-bed",
      name: "Twin Arch Bed",
      slug: "twin-arch-bed",
      sku: "BED-TWA-01",
      material: "16mm Lasani MDF frame with velvet upholstery",
      care: CARE_VELVET,
      height: "51",
      description:
        "Cream bed with a twin adjoining rounded-arch headboard and slim gold legs. A soft, contemporary king size bed for a calm modern bedroom.",
      tags: ["arched headboard bed", "twin panel bed", "cream bed", "king size bed", "modern bedroom"],
      finishes: [{ name: "Beige", images: ["Twin Arch Bed/Beige (1).png", "Twin Arch Bed/Beige (2).png"] }],
    },
    {
      _id: "product-two-tone-panel-bed",
      name: "Two-Tone Panel Bed",
      slug: "two-tone-panel-bed",
      sku: "BED-2TP-01",
      material: "16mm Lasani MDF frame with two-tone upholstery and leather strap accents",
      care: CARE_VELVET,
      height: "48",
      description:
        "Bed with a two-tone headboard — a cream center panel flanked by colored side wings, joined with brass-buckled leather straps — and a matching channel-tufted footboard. A layered, tailored king size bed for a modern bedroom.",
      tags: ["two-tone bed", "panel bed", "strap accent bed", "king size bed", "modern bedroom"],
      finishes: [
        { name: "Brown",       images: ["Two-Tone Panel Bed/two-tone-panel-bed-brown-king-size-bed-1.png"] },
        { name: "Taupe",       images: ["Two-Tone Panel Bed/two-tone-panel-bed-taupe-king-size-bed-1.png"] },
        { name: "Beige",       images: ["Two-Tone Panel Bed/two-tone-panel-bed-beige-king-size-bed-1.png"] },
        { name: "Dark Grey",   images: ["Two-Tone Panel Bed/two-tone-panel-bed-dark-grey-king-size-bed-1.png"] },
        { name: "Olive Green", images: ["Two-Tone Panel Bed/two-tone-panel-bed-olive-green-king-size-bed-1.png"] },
        { name: "Taupe Brown", images: ["Two-Tone Panel Bed/two-tone-panel-bed-taupe-brown-king-size-bed-1.png"] },
      ],
    },
  ]

  console.log(`Seeding ${beds.length} beds…`)
  for (const bed of beds) {
    console.log(`  uploading images for ${bed.name}…`)
    const finishes = await Promise.all(
      bed.finishes.map(async (f, i) => ({
        _key: `f${i + 1}`,
        name: f.name,
        priceModifier: 0,
        images: await finishImagesField(bed.slug, f.name, f.images),
      }))
    )
    // Default gallery = the first finish's photos (page loads on variant 0 /
    // finish 0 by default, matching the product page's own fallback logic).
    const images = finishes[0].images

    await client.createOrReplace({
      _type: "product",
      _id: bed._id,
      name: bed.name,
      slug: { current: bed.slug },
      category: { _type: "reference", _ref: catMap.beds },
      images,
      basePrice: 75000,
      sku: bed.sku,
      stockCount: 10,
      inStock: true,
      featured: false,
      material: bed.material,
      description: bed.description,
      careInstructions: bed.care,
      tags: bed.tags,
      dimensions: { width: "72", height: bed.height, depth: "78", unit: "in" },
      finishes,
      variants: SIZE_VARIANTS,
    })
    console.log(`  ✓ ${bed.name}`)
  }

  console.log(`✓ ${uploadedAssetIds.size} images uploaded, ${beds.length} beds seeded`)
}

seed().catch((err) => { console.error(err); process.exit(1) })
