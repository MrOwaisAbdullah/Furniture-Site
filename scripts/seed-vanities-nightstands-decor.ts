/**
 * Seeds 20 products from D:\Furniture\Generated: 8 dressing tables/consoles,
 * 6 nightstands, 2 coffee tables, 1 storage bench, 1 wardrobe (5 colors),
 * 2 standing floor mirrors. Run:
 *   node_modules/.bin/tsx scripts/seed-vanities-nightstands-decor.ts
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

const uploadedAssetIds = new Map<string, string>()

// Local files are already named "<product>-<color>-<keyword>-<n>.png" (SEO
// filename = disk filename, no separate generation needed).
async function uploadImage(relativePath: string) {
  const cached = uploadedAssetIds.get(relativePath)
  if (cached) return cached
  const raw = readFileSync(`${IMG_ROOT}/${relativePath}`)
  const watermarked = await watermarkImage(raw)
  const filename = relativePath.split("/").pop()!
  const asset = await client.assets.upload("image", watermarked, { filename })
  uploadedAssetIds.set(relativePath, asset._id)
  return asset._id
}

async function imageField(relativePath: string, key: string) {
  const assetId = await uploadImage(relativePath)
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: assetId } }
}

async function finishImagesField(relativePaths: string[]) {
  return Promise.all(relativePaths.map((p, i) => imageField(p, `img${i + 1}`)))
}

const CARE_WIPE = "Wipe with a dry or slightly damp cloth. Avoid moisture."
const CARE_MIRROR = "Polish mirror weekly. Wipe body with a dry cloth."
const CARE_MIRROR_STOOL = "Polish mirror weekly. Vacuum stool upholstery. Wipe body with a dry cloth."
const CARE_VELVET = "Vacuum upholstery weekly. Spot clean with a dry or slightly damp cloth."
const CARE_GLASS = "Wipe glass with a glass cleaner. Wipe frame with a dry cloth."

const NIGHTSTAND_VARIANTS = [
  { _key: "v1", size: "Single", priceModifier: 0 },
  { _key: "v2", size: "Pair",   priceModifier: 12000 },
]

// No dimensions yet for this batch — real measurements to be added later.
const NO_DIMENSIONS = { width: "", height: "", depth: "", unit: "in" }

interface SeedProduct {
  _id: string
  name: string
  slug: string
  sku: string
  category: string
  basePrice: number
  material: string
  care: string
  description: string
  tags: string[]
  finishes: { name: string; images: string[] }[]
  variants?: { _key: string; size: string; priceModifier: number }[]
  dimensions?: { width: string; height: string; depth: string; unit: string }
}

async function seed() {
  console.log("Ensuring Decor & Accents category…")
  const decorCat = await client.createOrReplace({
    _type: "category",
    _id: "category-decor",
    name: "Decor & Accents",
    slug: { current: "decor" },
    order: 6,
    description: "Coffee tables, storage benches, and accent pieces that match any room",
  })
  console.log(`  ✓ ${decorCat.name}`)

  const catMap = {
    "dressing-tables": "category-dressing-tables",
    "side-tables": "category-side-tables",
    wardrobes: "category-wardrobes",
    decor: decorCat._id,
  }

  const products: SeedProduct[] = [
    // ── Dressing tables / consoles ──────────────────────────────────────
    {
      _id: "product-x-door-console",
      name: "X-Door Console",
      slug: "x-door-console",
      sku: "DRS-XDR-01",
      category: "dressing-tables",
      basePrice: 35000,
      material: "16mm Lasani MDF frame with a cane lattice door panel",
      care: CARE_WIPE,
      description: "Two-tone console with a 3-drawer chest on one side and a woven X-lattice door on the other, finished with brass hardware. A versatile dressing console for a modern bedroom.",
      tags: ["dressing console", "console table", "x-lattice door", "storage console", "bedroom furniture"],
      finishes: [{ name: "Dark Grey", images: ["X-Door Console/x-door-console-dark-grey-console-table-1.png", "X-Door Console/x-door-console-dark-grey-console-table-2.png"] }],
    },
    {
      _id: "product-rattan-arch-console",
      name: "Rattan Arch Console",
      slug: "rattan-arch-console",
      sku: "DRS-RTN-01",
      category: "dressing-tables",
      basePrice: 35000,
      material: "16mm Lasani MDF frame with rattan cane arch door panels",
      care: CARE_WIPE,
      description: "Walnut-finish console with 3 drawers and arched rattan cane door panels. A warm, textured dressing console for a modern bedroom.",
      tags: ["rattan console", "cane door console", "dressing console", "walnut console", "bedroom storage"],
      finishes: [{ name: "Brown", images: ["Rattan Arch Console/rattan-arch-console-brown-console-table-1.png", "Rattan Arch Console/rattan-arch-console-brown-console-table-2.png"] }],
    },
    {
      _id: "product-ring-pull-dresser",
      name: "Ring-Pull Dresser",
      slug: "ring-pull-dresser",
      sku: "DRS-RGP-01",
      category: "dressing-tables",
      basePrice: 35000,
      material: "16mm Lasani MDF frame with brass ring-pull hardware",
      care: CARE_WIPE,
      description: "Light oak 6-drawer dresser with brass ring pulls and a dark banded accent strip. A clean, versatile storage dresser for a modern bedroom.",
      tags: ["ring pull dresser", "6 drawer dresser", "oak dresser", "bedroom storage", "dressing console"],
      finishes: [{ name: "Brown", images: ["Ring-Pull Dresser/ring-pull-dresser-brown-dresser-1.png", "Ring-Pull Dresser/ring-pull-dresser-brown-dresser-2.png"] }],
    },
    {
      _id: "product-cloud-mirror-vanity",
      name: "Cloud Mirror Vanity",
      slug: "cloud-mirror-vanity",
      sku: "DRS-CLM-01",
      category: "dressing-tables",
      basePrice: 45000,
      material: "16mm Lasani MDF frame with a scalloped mirror and gold blade legs",
      care: CARE_MIRROR,
      description: "White dressing table with a scalloped cloud-shaped mirror, 3-drawer pedestal, and slim gold blade legs. A soft, elegant vanity for a modern bedroom.",
      tags: ["dressing table with mirror", "vanity table", "white vanity", "cloud mirror", "bedroom vanity"],
      finishes: [{ name: "White", images: ["Cloud Mirror Vanity/cloud-mirror-vanity-white-dressing-table-mirror-1.png", "Cloud Mirror Vanity/cloud-mirror-vanity-white-dressing-table-mirror-2.png"] }],
    },
    {
      _id: "product-backlit-round-vanity",
      name: "Backlit Round Vanity",
      slug: "backlit-round-vanity",
      sku: "DRS-BLR-01",
      category: "dressing-tables",
      basePrice: 52000,
      material: "16mm Lasani MDF frame with a round backlit LED mirror and matching pouf stool",
      care: CARE_MIRROR_STOOL,
      description: "Rust-toned dressing table with a round backlit LED mirror, gold legs, and a matching upholstered pouf stool. A warm, glamorous vanity set for a modern bedroom — dressing table, mirror, and stool all included.",
      tags: ["dressing table with mirror and stool", "backlit vanity", "led mirror vanity", "vanity set", "rust vanity"],
      finishes: [{ name: "Rust", images: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `Backlit Round Vanity/backlit-round-vanity-rust-vanity-set-${i}.png`) }],
    },
    {
      _id: "product-oval-vanity",
      name: "Oval Vanity",
      slug: "oval-vanity",
      sku: "DRS-OVL-01",
      category: "dressing-tables",
      basePrice: 52000,
      material: "16mm Lasani MDF frame with an oval mirror and a ribbed pouf stool",
      care: CARE_MIRROR_STOOL,
      description: "Ivory dressing table with a round mirror, ribbed 5-drawer pedestal, tapered gold legs, and a matching ribbed pouf stool. A soft, elegant vanity set for a modern bedroom — dressing table, mirror, and stool all included.",
      tags: ["dressing table with mirror and stool", "oval vanity", "ivory vanity", "vanity set", "ribbed vanity"],
      finishes: [{ name: "Offwhite", images: [1, 2, 3, 4].map((i) => `Oval Vanity/oval-vanity-offwhite-vanity-set-${i}.png`) }],
    },
    {
      _id: "product-velvet-arch-vanity",
      name: "Velvet Arch Vanity",
      slug: "velvet-arch-vanity",
      sku: "DRS-VLA-01",
      category: "dressing-tables",
      basePrice: 52000,
      material: "16mm Lasani MDF frame with a velvet-trimmed arched mirror and a ribbed velvet stool",
      care: CARE_MIRROR_STOOL,
      description: "Grey velvet dressing table with a rounded-square gold-trim mirror, fluted arch pedestal, brass legs, and a matching ribbed stool. A refined vanity set for a modern bedroom — dressing table, mirror, and stool all included.",
      tags: ["dressing table with mirror and stool", "velvet vanity", "grey vanity", "vanity set", "arched vanity"],
      finishes: [{ name: "Gray", images: ["Velvet Arch Vanity/velvet-arch-vanity-gray-vanity-set-1.png", "Velvet Arch Vanity/velvet-arch-vanity-gray-vanity-set-2.png"] }],
    },
    {
      _id: "product-arch-cabinet-vanity",
      name: "Arch Cabinet Vanity",
      slug: "arch-cabinet-vanity",
      sku: "DRS-ARC-01",
      category: "dressing-tables",
      basePrice: 52000,
      material: "16mm Lasani MDF frame with a tall arched mirror, glass display cabinet, and a cushioned stool",
      care: CARE_MIRROR_STOOL,
      description: "Dressing table with a tall arched mirror, 3-drawer arched pedestal, an attached glass display cabinet, and a cushioned stool. A statement vanity set for a modern bedroom — dressing table, mirror, and stool all included.",
      tags: ["dressing table with mirror and stool", "vanity with cabinet", "glass display vanity", "vanity set", "arched vanity"],
      finishes: [{ name: "Purple", images: [1, 2, 3, 4, 5, 6].map((i) => `Arch Cabinet Vanity/arch-cabinet-vanity-purple-vanity-set-${i}.png`) }],
    },

    // ── Nightstands ──────────────────────────────────────────────────────
    {
      _id: "product-arched-fluted-nightstand",
      name: "Arched Fluted Nightstand",
      slug: "arched-fluted-nightstand",
      sku: "NST-AFL-01",
      category: "side-tables",
      basePrice: 18000,
      material: "16mm Lasani MDF frame with fluted arch corner panels",
      care: CARE_WIPE,
      description: "Nightstand with fluted arch corner panels, brass round knobs, and tapered gold legs. A refined bedside table for a modern bedroom. Available single or as a matching pair.",
      tags: ["nightstand", "side table", "bedside table", "fluted nightstand", "arched nightstand", "bedroom furniture"],
      finishes: [{ name: "Dark Grey", images: [1, 2, 3].map((i) => `Arched Fluted Nightstand/arched-fluted-nightstand-dark-grey-nightstand-${i}.png`) }],
      variants: NIGHTSTAND_VARIANTS,
    },
    {
      _id: "product-reeded-nightstand",
      name: "Reeded Nightstand",
      slug: "reeded-nightstand",
      sku: "NST-RDD-01",
      category: "side-tables",
      basePrice: 18000,
      material: "16mm Lasani MDF frame with a vertical reeded front",
      care: CARE_WIPE,
      description: "Nightstand with a vertical reeded front, brass bar pull, and hammered brass tapered legs. A textured bedside table for a modern bedroom. Available single or as a matching pair.",
      tags: ["nightstand", "side table", "reeded nightstand", "bedside table", "textured furniture", "bedroom furniture"],
      finishes: [{ name: "Olive Green", images: ["Reeded Nightstand/reeded-nightstand-olive-green-nightstand-1.png", "Reeded Nightstand/reeded-nightstand-olive-green-nightstand-2.png"] }],
      variants: NIGHTSTAND_VARIANTS,
    },
    {
      _id: "product-marble-top-ribbed-nightstand-round",
      name: "Marble-Top Ribbed Nightstand (Round)",
      slug: "marble-top-ribbed-nightstand-round",
      sku: "NST-MTR-RD-01",
      category: "side-tables",
      basePrice: 18000,
      material: "16mm Lasani MDF frame with a marble-look top and ribbed drawer front",
      care: CARE_WIPE,
      description: "Ribbed nightstand with a marble-look top, gold trim, brass bar pull, and tapered gold legs — symmetric on both sides, so it works on either side of the bed. Available single or as a matching pair.",
      tags: ["nightstand", "nightstand pair", "side table", "side table pair", "marble top nightstand", "ribbed nightstand", "bedside table", "bedroom furniture"],
      finishes: [{
        name: "Beige",
        images: [
          ...[1, 2].map((i) => `Marble-Top Ribbed Nightstand (Round)/marble-top-ribbed-nightstand-round-beige-nightstand-${i}.png`),
          ...[1, 2].map((i) => `Marble-Top Ribbed Nightstand (Paired)/marble-top-ribbed-nightstand-paired-beige-nightstand-pair-${i}.png`),
        ],
      }],
      variants: NIGHTSTAND_VARIANTS,
    },
    {
      _id: "product-glow-shelf-nightstand",
      name: "Glow Shelf Nightstand",
      slug: "glow-shelf-nightstand",
      sku: "NST-GLW-01",
      category: "side-tables",
      basePrice: 18000,
      material: "16mm Lasani MDF frame with a glass top and LED under-shelf lighting",
      care: "Wipe clean with a dry cloth. Avoid moisture near the LED strip.",
      description: "Rounded 2-tier nightstand with a glass top and a glowing LED under-shelf strip. A modern bedside table with ambient lighting. Available single or as a matching pair.",
      tags: ["nightstand", "side table", "led nightstand", "glass top nightstand", "bedside table", "modern bedroom"],
      finishes: [{ name: "Gray", images: ["Glow Shelf Nightstand/glow-shelf-nightstand-gray-nightstand-1.png", "Glow Shelf Nightstand/glow-shelf-nightstand-gray-nightstand-2.png"] }],
      variants: NIGHTSTAND_VARIANTS,
    },
    {
      _id: "product-ring-pull-nightstand",
      name: "Ring-Pull Nightstand",
      slug: "ring-pull-nightstand",
      sku: "NST-RGP-01",
      category: "side-tables",
      basePrice: 18000,
      material: "16mm Lasani MDF frame with brass ring-pull hardware",
      care: CARE_WIPE,
      description: "Warm oak nightstand with a dark contrasting top, brass ring pulls, and tapered gold legs. A classic bedside table for a modern bedroom. Available single or as a matching pair.",
      tags: ["nightstand", "side table", "ring pull nightstand", "oak nightstand", "bedside table", "bedroom furniture"],
      finishes: [{ name: "Brown", images: ["Ring-Pull Nightstand/ring-pull-nightstand-brown-nightstand-1.png", "Ring-Pull Nightstand/ring-pull-nightstand-brown-nightstand-2.png"] }],
      variants: NIGHTSTAND_VARIANTS,
    },
    {
      _id: "product-two-tone-panel-nightstand",
      name: "Two-Tone Panel Nightstand",
      slug: "two-tone-panel-nightstand",
      sku: "NST-2TN-01",
      category: "side-tables",
      basePrice: 18000,
      material: "16mm Lasani MDF frame with a contrast black drawer panel",
      care: CARE_WIPE,
      description: "Two-tone nightstand with an ivory body, black drawer panel, brass ring and bar pulls, and black block feet. A crisp, contemporary bedside table. Available single or as a matching pair.",
      tags: ["nightstand", "side table", "two-tone nightstand", "black and white nightstand", "bedside table", "modern bedroom"],
      finishes: [{ name: "White", images: ["Two-Tone Panel Nightstand/two-tone-panel-nightstand-white-nightstand-1.png"] }],
      variants: NIGHTSTAND_VARIANTS,
    },

    // ── Coffee tables & storage ──────────────────────────────────────────
    {
      _id: "product-double-shelf-nesting-coffee-table",
      name: "Double-Shelf Nesting Coffee Table",
      slug: "double-shelf-nesting-coffee-table",
      sku: "CFT-DBL-01",
      category: "decor",
      basePrice: 35000,
      material: "16mm Lasani MDF frame with tempered glass top and open double-shelf storage",
      care: CARE_GLASS,
      description: "Coffee table with a tempered glass top, open double-shelf storage on each side, and a tucked-under upholstered ottoman. A functional centerpiece for any living room.",
      tags: ["coffee table", "glass top coffee table", "nesting coffee table", "living room furniture", "storage coffee table"],
      finishes: [{ name: "Dark Grey", images: ["Double-Shelf Nesting Coffee Table/double-shelf-nesting-coffee-table-dark-grey-coffee-table-1.png"] }],
    },
    {
      _id: "product-nesting-ottoman-coffee-table",
      name: "Nesting Ottoman Coffee Table",
      slug: "nesting-ottoman-coffee-table",
      sku: "CFT-OTM-01",
      category: "decor",
      basePrice: 35000,
      material: "16mm Lasani MDF frame with tempered glass top and open shelf storage",
      care: "Wipe glass with a glass cleaner. Wipe frame with a dry cloth. Vacuum ottoman upholstery.",
      description: "Coffee table with a tempered glass top, open shelf storage, and a nesting upholstered ottoman tucked underneath. A versatile centerpiece for any living room.",
      tags: ["coffee table", "ottoman coffee table", "nesting coffee table", "living room furniture", "glass top coffee table"],
      finishes: [{ name: "Dark Grey", images: ["Nesting Ottoman Coffee Table/nesting-ottoman-coffee-table-dark-grey-coffee-table-1.png", "Nesting Ottoman Coffee Table/nesting-ottoman-coffee-table-dark-grey-coffee-table-2.png"] }],
    },
    {
      _id: "product-channel-storage-bench",
      name: "Channel Storage Bench",
      slug: "channel-storage-bench",
      sku: "STG-CHN-01",
      category: "decor",
      basePrice: 30000,
      material: "16mm Lasani MDF frame with channel-tufted velvet upholstery and storage compartment",
      care: CARE_VELVET,
      description: "Channel-tufted velvet storage bench with slim tapered legs, available in 8 colors. A soft-close storage seat for the end of a bed or living room.",
      tags: ["storage bench", "tufted bench", "bedroom bench", "upholstered bench", "storage ottoman"],
      finishes: [
        { name: "Light Blue",    images: ["Channel Storage Bench/channel-storage-bench-light-blue-storage-bench-1.png", "Channel Storage Bench/channel-storage-bench-light-blue-storage-bench-2.png"] },
        { name: "Beige",         images: ["Channel Storage Bench/channel-storage-bench-beige-storage-bench.png"] },
        { name: "Emerald Green", images: ["Channel Storage Bench/channel-storage-bench-green-storage-bench.png"] },
        { name: "Dark Grey",     images: ["Channel Storage Bench/channel-storage-bench-grey-storage-bench.png"] },
        { name: "Olive Green",   images: ["Channel Storage Bench/channel-storage-bench-olive-green-storage-bench.png"] },
        { name: "Pink",          images: ["Channel Storage Bench/channel-storage-bench-pink-storage-bench.png"] },
        { name: "Rust",          images: ["Channel Storage Bench/channel-storage-bench-rust-storage-bench.png"] },
        { name: "White",         images: ["Channel Storage Bench/channel-storage-bench-white-storage-bench.png"] },
      ],
      dimensions: { width: "72", height: "24", depth: "16", unit: "in" },
      variants: [
        { _key: "v1", size: "King",   priceModifier: 0 },
        { _key: "v2", size: "Queen",  priceModifier: -4000 },
        { _key: "v3", size: "Single", priceModifier: -8000 },
      ],
    },

    // ── Wardrobe ─────────────────────────────────────────────────────────
    {
      _id: "product-glass-niche-wardrobe",
      name: "Glass Niche Wardrobe",
      slug: "glass-niche-wardrobe",
      sku: "WRD-GLN-01",
      category: "wardrobes",
      basePrice: 85000,
      material: "16mm Lasani MDF frame with a backlit glass display niche and brass hardware",
      care: "Wipe with a dry or slightly damp cloth. Polish glass niche weekly. Avoid moisture.",
      description: "4-door wardrobe with hanging rails, shelves, and a backlit glass display niche down the center, finished with brass keyhole hardware. A statement storage piece for a modern bedroom.",
      tags: ["wardrobe", "4 door wardrobe", "glass display wardrobe", "bedroom storage", "modern wardrobe"],
      finishes: [
        { name: "Gray",       images: [1, 2, 3, 4].map((i) => `Glass Niche Wardrobe/glass-niche-wardrobe-gray-wardrobe-${i}.png`) },
        { name: "Beige",      images: ["Glass Niche Wardrobe/glass-niche-wardrobe-beige-wardrobe-1.png"] },
        { name: "Black",      images: ["Glass Niche Wardrobe/glass-niche-wardrobe-black-wardrobe-1.png"] },
        { name: "Blue",       images: ["Glass Niche Wardrobe/glass-niche-wardrobe-blue-wardrobe-1.png"] },
        { name: "Terracotta", images: ["Glass Niche Wardrobe/glass-niche-wardrobe-terracotta-wardrobe-1.png"] },
      ],
    },

    // ── Standing / floor mirrors ─────────────────────────────────────────
    {
      _id: "product-wavy-frame-floor-mirror",
      name: "Wavy Frame Floor Mirror",
      slug: "wavy-frame-floor-mirror",
      sku: "MIR-WVF-01",
      category: "decor",
      basePrice: 28000,
      material: "16mm Lasani MDF frame with upholstered wavy scalloped edging",
      care: CARE_WIPE,
      description: "Full-length standing mirror with an upholstered wavy scalloped frame and a rounded arch top. A statement accent piece that leans against any wall.",
      tags: ["standing mirror", "floor mirror", "wavy mirror", "full length mirror", "decor accent"],
      finishes: [
        { name: "Black",        images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-black-standing-mirror-1.png"] },
        { name: "Blush",        images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-blush-standing-mirror-1.png"] },
        { name: "Dark Grey",    images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-dark-gray-standing-mirror-1.png"] },
        { name: "Light Blue",   images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-light-blue-standing-mirror-1.png"] },
        { name: "Olive Green",  images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-olive-green-standing-mirror-1.png"] },
        { name: "Pastel Blue",  images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-pastel-blue-standing-mirror-1.png"] },
        { name: "Pink",         images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-pink-standing-mirror-1.png"] },
        { name: "Terracotta",   images: ["Wavy Frame Floor Mirror/wavy-frame-floor-mirror-terracotta-standing-mirror-1.png"] },
      ],
    },
    {
      _id: "product-organic-oval-floor-mirror",
      name: "Organic Oval Floor Mirror",
      slug: "organic-oval-floor-mirror",
      sku: "MIR-OOV-01",
      category: "decor",
      basePrice: 28000,
      material: "16mm Lasani MDF frame with upholstered organic-curve edging",
      care: CARE_WIPE,
      description: "Full-length standing mirror with a smooth, organic asymmetric-oval upholstered frame. A soft, sculptural accent piece that leans against any wall.",
      tags: ["standing mirror", "floor mirror", "organic mirror", "oval mirror", "full length mirror", "decor accent"],
      finishes: [
        { name: "Black",       images: ["Organic Oval Floor Mirror/organic-oval-floor-mirror-black-standing-mirror-1.png"] },
        { name: "White",       images: ["Organic Oval Floor Mirror/organic-oval-floor-mirror-cream-standing-mirror-1.png"] },
        { name: "Olive Green", images: ["Organic Oval Floor Mirror/organic-oval-floor-mirror-olive-standing-mirror-1.png"] },
        { name: "Pastel Blue", images: ["Organic Oval Floor Mirror/organic-oval-floor-mirror-pastel-blue-standing-mirror-1.png"] },
        { name: "Pink",        images: ["Organic Oval Floor Mirror/organic-oval-floor-mirror-pink-standing-mirror-1.png"] },
      ],
    },
  ]

  console.log(`Seeding ${products.length} products…`)
  for (const p of products) {
    console.log(`  uploading images for ${p.name}…`)
    const finishes = await Promise.all(
      p.finishes.map(async (f, i) => ({
        _key: `f${i + 1}`,
        name: f.name,
        priceModifier: 0,
        images: await finishImagesField(f.images),
      }))
    )
    // Default gallery = the first finish's photos (page loads on finish 0 by
    // default, matching the product page's own fallback logic).
    const images = finishes[0].images

    await client.createOrReplace({
      _type: "product",
      _id: p._id,
      name: p.name,
      slug: { current: p.slug },
      category: { _type: "reference", _ref: catMap[p.category as keyof typeof catMap] },
      images,
      basePrice: p.basePrice,
      sku: p.sku,
      stockCount: 10,
      inStock: true,
      featured: false,
      material: p.material,
      description: p.description,
      careInstructions: p.care,
      tags: p.tags,
      dimensions: p.dimensions ?? NO_DIMENSIONS,
      finishes,
      variants: p.variants ?? [],
    })
    console.log(`  ✓ ${p.name}`)
  }

  console.log(`✓ ${uploadedAssetIds.size} images uploaded, ${products.length} products seeded`)
}

seed().catch((err) => { console.error(err); process.exit(1) })
