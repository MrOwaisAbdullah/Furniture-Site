/**
 * Run: npm run seed:sanity
 * Requires: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in .env.local
 *
 * Uses createOrReplace (not createIfNotExists) so re-running this after the
 * images change actually updates docs an earlier, image-less run of this
 * script already created — createIfNotExists is a no-op once a doc with
 * that _id exists, which is why products had no preview thumbnails before.
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"
import { readFileSync } from "fs"
import { join } from "path"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:    false,
  token:     process.env.SANITY_API_WRITE_TOKEN!,
})

// Same stock photos already used in src/data/sample-products.ts, reused here
// so Studio previews show something real instead of nothing. Side table
// uses a local file in public/ (the Unsplash URl for it was dead — 404).
const IMG_URLS = {
  bed:       "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=900&q=80",
  wardrobe:  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80",
  dressing:  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
  sideTable: "/pexels-netoo-21352802.jpg",
  set:       "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=900&q=80",
}

const uploadedAssetIds = new Map<string, string>()

async function uploadImage(source: string) {
  const cached = uploadedAssetIds.get(source)
  if (cached) return cached

  let buffer: Buffer
  let filename: string
  if (source.startsWith("/")) {
    // Local file under public/
    buffer = readFileSync(join(process.cwd(), "public", source))
    filename = source.split("/").pop()!
  } else {
    const res = await fetch(source)
    if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.status}`)
    buffer = Buffer.from(await res.arrayBuffer())
    filename = source.split("/").pop()!.split("?")[0] + ".jpg"
  }

  const asset = await client.assets.upload("image", buffer, { filename })
  uploadedAssetIds.set(source, asset._id)
  return asset._id
}

async function imageField(url: string, key: string) {
  const assetId = await uploadImage(url)
  return { _type: "image", _key: key, asset: { _type: "reference", _ref: assetId } }
}

const categories = [
  { _type: "category", name: "Bedroom Sets",    slug: { current: "bedroom-sets"    }, order: 1, description: "Complete bedroom furniture packages" },
  { _type: "category", name: "Beds",            slug: { current: "beds"            }, order: 2, description: "Bed frames in all sizes" },
  { _type: "category", name: "Wardrobes",       slug: { current: "wardrobes"       }, order: 3, description: "3-door and 4-door wardrobes" },
  { _type: "category", name: "Dressing Tables", slug: { current: "dressing-tables" }, order: 4, description: "Dressing tables with mirrors and stools" },
  { _type: "category", name: "Side Tables",     slug: { current: "side-tables"     }, order: 5, description: "Side tables in pairs" },
]

async function seed() {
  console.log("Seeding categories…")
  const catDocs = await Promise.all(
    categories.map((c) =>
      client.createIfNotExists({ ...c, _id: `category-${c.slug.current}` })
    )
  )
  console.log(`✓ ${catDocs.length} categories seeded`)

  // Resolve category refs
  const catMap = Object.fromEntries(catDocs.map((c: any) => [c.slug.current, c._id]))

  console.log("Uploading images…")
  const images = {
    bed: [await imageField(IMG_URLS.bed, "img1")],
    wardrobe: [await imageField(IMG_URLS.wardrobe, "img1")],
    dressing: [await imageField(IMG_URLS.dressing, "img1")],
    sideTable: [await imageField(IMG_URLS.sideTable, "img1")],
    set: [await imageField(IMG_URLS.set, "img1")],
  }
  console.log(`✓ ${uploadedAssetIds.size} images uploaded`)

  const products = [
    {
      _type: "product",
      _id:   "product-king-foam-bed",
      name:  "King Foam Bed",
      slug:  { current: "king-foam-bed" },
      category: { _type: "reference", _ref: catMap["beds"] },
      images: images.bed,
      basePrice: 65000,
      inStock:   true,
      featured:  true,
      material:  "16mm Lasani MDF",
      description: "Workshop-built king size bed with foam-padded headboard. Available in Walnut and White finishes.",
      careInstructions: "Wipe clean with dry cloth. Avoid moisture.",
      tags: ["king size", "foam headboard", "walnut", "bedroom"],
      dimensions: { width: "183", height: "120", depth: "213", unit: "cm" },
      finishes: [
        { _key: "f1", name: "Walnut", hexColor: "#6B4C2A", priceModifier: 0 },
        { _key: "f2", name: "White",  hexColor: "#FFFFFF", priceModifier: 0 },
      ],
      variants: [
        { _key: "v1", size: "King",   priceModifier: 0 },
        { _key: "v2", size: "Queen",  priceModifier: -5000 },
        { _key: "v3", size: "Single", priceModifier: -15000 },
      ],
    },
    {
      _type: "product",
      _id:   "product-3-door-wardrobe",
      name:  "3-Door Wardrobe",
      slug:  { current: "3-door-wardrobe" },
      category: { _type: "reference", _ref: catMap["wardrobes"] },
      images: images.wardrobe,
      basePrice: 75000,
      inStock:   true,
      featured:  false,
      material:  "18mm MFC Board",
      description: "Full-height 3-door wardrobe with hanging rail, shelves, and mirror insert option.",
      careInstructions: "Wipe with slightly damp cloth. Keep dry.",
      tags: ["wardrobe", "3 door", "full height", "storage"],
      dimensions: { width: "150", height: "210", depth: "60", unit: "cm" },
      finishes: [
        { _key: "f1", name: "Walnut", hexColor: "#6B4C2A", priceModifier: 0 },
        { _key: "f2", name: "Ivory",  hexColor: "#F5F0E8", priceModifier: 0 },
      ],
      variants: [{ _key: "v1", size: "Standard", priceModifier: 0 }],
    },
    {
      _type: "product",
      _id:   "product-dressing-table-mirror",
      name:  "Dressing Table with Mirror",
      slug:  { current: "dressing-table-with-mirror" },
      category: { _type: "reference", _ref: catMap["dressing-tables"] },
      images: images.dressing,
      basePrice: 45000,
      inStock:   true,
      featured:  false,
      material:  "16mm Lasani MDF",
      description: "Contemporary dressing table with full-length mirror and 4-drawer chest.",
      careInstructions: "Polish mirror weekly. Avoid direct sunlight.",
      tags: ["dressing table", "mirror", "4 drawer", "vanity"],
      dimensions: { width: "120", height: "150", depth: "45", unit: "cm" },
      finishes: [
        { _key: "f1", name: "Walnut", hexColor: "#6B4C2A", priceModifier: 0 },
        { _key: "f2", name: "White",  hexColor: "#FFFFFF", priceModifier: 0 },
      ],
      variants: [{ _key: "v1", size: "Standard", priceModifier: 0 }],
    },
    {
      _type: "product",
      _id:   "product-side-table-pair",
      name:  "Side Table Pair",
      slug:  { current: "side-table-pair" },
      category: { _type: "reference", _ref: catMap["side-tables"] },
      images: images.sideTable,
      basePrice: 18000,
      inStock:   true,
      featured:  false,
      material:  "16mm Lasani MDF",
      description: "Matching pair of bedside tables with single drawer and open shelf.",
      careInstructions: "Wipe clean. Avoid leaving drinks directly on surface.",
      tags: ["side table", "bedside", "pair", "drawer"],
      dimensions: { width: "45", height: "55", depth: "40", unit: "cm" },
      finishes: [
        { _key: "f1", name: "Walnut", hexColor: "#6B4C2A", priceModifier: 0 },
        { _key: "f2", name: "White",  hexColor: "#FFFFFF", priceModifier: 0 },
      ],
      variants: [{ _key: "v1", size: "Standard", priceModifier: 0 }],
    },
    {
      _type: "product",
      _id:   "product-full-bedroom-set",
      name:  "Full Bedroom Set",
      slug:  { current: "full-bedroom-set" },
      category: { _type: "reference", _ref: catMap["bedroom-sets"] },
      images: images.set,
      basePrice: 330000,
      inStock:   true,
      featured:  true,
      material:  "16mm Lasani MDF",
      description: "Complete bedroom package: king bed frame, 2 side tables, dressing table with stool, and 3-door wardrobe. Best value — save vs individual purchase.",
      careInstructions: "Wipe clean with dry cloth. Avoid moisture.",
      tags: ["bedroom set", "complete", "king size", "best value", "wardrobe included"],
      dimensions: { width: "183", height: "120", depth: "213", unit: "cm" },
      finishes: [
        { _key: "f1", name: "Walnut", hexColor: "#6B4C2A", priceModifier: 0 },
        { _key: "f2", name: "Ivory",  hexColor: "#F5F0E8", priceModifier: 0 },
      ],
      variants: [
        { _key: "v1", size: "King",  priceModifier: 0 },
        { _key: "v2", size: "Queen", priceModifier: -15000 },
      ],
    },
  ]

  console.log("Seeding products…")
  const prodDocs = await Promise.all(products.map((p) => client.createOrReplace(p)))
  console.log(`✓ ${prodDocs.length} products seeded`)
  console.log("Seed complete.")
}

seed().catch((err) => { console.error(err); process.exit(1) })
