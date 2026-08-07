/**
 * Seeds the 4 new products organized from D:\Furniture\Generated:
 *   - Rabbit Ear Stool           (11 photos, 9 colors, Rs 8,000, single only)
 *   - Round Marble Coffee Table  (2 photos, Rs 44,000)
 *   - Rectangular Marble-Top Coffee Table (1 photo, Rs 38,000)
 *   - Navy Oval-Mirror Vanity    (2 photos, Rs 52,000, vanity + mirror)
 * One-off — doesn't touch any other seed file. Run:
 *   npx tsx scripts/seed-4-new-products.ts
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

async function uploadImage(relPath: string, productSlug: string) {
  const full = `${GENERATED_ROOT}/${relPath}`
  if (!existsSync(full)) throw new Error(`Missing image: ${full}`)
  const raw = readFileSync(full)
  const watermarked = await watermarkImage(raw)
  const asset = await client.assets.upload("image", watermarked, {
    filename: `${productSlug}-${relPath.split("/").pop()!.toLowerCase()}`,
  })
  return asset._id
}

async function imagesField(relPaths: string[], productSlug: string) {
  return Promise.all(
    relPaths.map(async (f, i) => {
      const assetId = await uploadImage(f, productSlug)
      return { _type: "image", _key: `img${i + 1}`, asset: { _type: "reference", _ref: assetId } }
    })
  )
}

type ProductSpec = {
  id: string
  name: string
  slug: string
  category: string
  sku: string
  basePrice: number
  material: string
  description: string
  careInstructions: string
  tags: string[]
  finishes: { name: string; files: string[] }[]
}

const STOOL = "Rabbit Ear Stool"
const ROUND = "Round Marble Coffee Table"
const RECT = "Rectangular Marble-Top Coffee Table"
const VANITY = "Navy Oval-Mirror Vanity"

const PRODUCTS: ProductSpec[] = [
  {
    id: "product-rabbit-ear-stool",
    name: "Rabbit Ear Stool",
    slug: "rabbit-ear-stool",
    category: "category-decor",
    sku: "STL-RBT-01",
    basePrice: 8000,
    material: "16mm Lasani MDF frame with soft upholstered seat",
    description: "Small upholstered stool with cute rabbit-ear backrests. A playful accent piece for a bedroom, nursery, or dressing corner — handy as a footstool or extra seat.",
    careInstructions: "Wipe with a dry or slightly damp cloth. Avoid moisture.",
    tags: ["stool", "rabbit ear stool", "upholstered stool", "footstool", "accent stool", "bedroom furniture"],
    finishes: [
      { name: "Black",  files: [`${STOOL}/rabbit-ear-stool-black-stool-1.png`, `${STOOL}/rabbit-ear-stool-black-stool-2.png`] },
      { name: "Pink",   files: [`${STOOL}/rabbit-ear-stool-pink-stool-1.png`] },
      { name: "Blue",   files: [`${STOOL}/rabbit-ear-stool-blue-stool-1.png`] },
      { name: "Green",  files: [`${STOOL}/rabbit-ear-stool-green-stool-1.png`] },
      { name: "Brown",  files: [`${STOOL}/rabbit-ear-stool-brown-stool-1.png`] },
      { name: "Yellow", files: [`${STOOL}/rabbit-ear-stool-yellow-stool-1.png`] },
      { name: "White",  files: [`${STOOL}/rabbit-ear-stool-white-stool-1.png`] },
      { name: "Beige",  files: [`${STOOL}/rabbit-ear-stool-beige-stool-1.png`, `${STOOL}/rabbit-ear-stool-beige-stool-2.png`] },
      { name: "Cream",  files: [`${STOOL}/rabbit-ear-stool-cream-stool-1.png`] },
    ],
  },
  {
    id: "product-round-marble-coffee-table",
    name: "Round Marble Coffee Table",
    slug: "round-marble-coffee-table",
    category: "category-decor",
    sku: "CFT-RND-01",
    basePrice: 44000,
    material: "16mm Lasani MDF frame with marble-sheet top and matching integrated side table",
    description: "Two-tier round coffee table with a marble-sheet top and a matching integrated round side table. A stylish centerpiece for any living room — table and side table together.",
    careInstructions: "Wipe with a dry or slightly damp cloth. Avoid moisture.",
    tags: ["coffee table", "marble coffee table", "round coffee table", "marble top coffee table", "living room furniture", "coffee table with side table"],
    finishes: [
      { name: "Black", files: [`${ROUND}/round-marble-coffee-table-black-coffee-table-1.png`, `${ROUND}/round-marble-coffee-table-black-coffee-table-2.png`] },
    ],
  },
  {
    id: "product-rectangular-marble-top-coffee-table",
    name: "Rectangular Marble-Top Coffee Table",
    slug: "rectangular-marble-top-coffee-table",
    category: "category-decor",
    sku: "CFT-MRB-01",
    basePrice: 38000,
    material: "16mm Lasani MDF frame with genuine marble top and round marble side table",
    description: "Rectangular coffee table with a real marble top on a black pedestal base, with a matching round marble side table. A premium centerpiece for the living room.",
    careInstructions: "Wipe with a dry or slightly damp cloth. Avoid moisture.",
    tags: ["coffee table", "marble coffee table", "marble top coffee table", "rectangular coffee table", "living room furniture", "coffee table with side table"],
    finishes: [
      { name: "Black", files: [`${RECT}/rectangular-marble-top-coffee-table-black-coffee-table-1.png`] },
    ],
  },
  {
    id: "product-navy-oval-mirror-vanity",
    name: "Navy Oval-Mirror Vanity",
    slug: "navy-oval-mirror-vanity",
    category: "category-dressing-tables",
    sku: "DRS-NOV-01",
    basePrice: 52000,
    material: "16mm Lasani MDF frame in navy blue with gold accents and oval mirror",
    description: "Dressing table with a tall oval mirror in navy blue with elegant gold accents. A statement vanity piece for a modern bedroom — vanity and mirror included.",
    careInstructions: "Polish mirror weekly. Wipe body with a dry cloth. Avoid moisture.",
    tags: ["dressing table", "vanity", "oval mirror vanity", "navy vanity", "gold accents vanity", "vanity set"],
    finishes: [
      { name: "Navy Blue", files: [`${VANITY}/navy-oval-mirror-vanity-navy-vanity-set-1.png`, `${VANITY}/navy-oval-mirror-vanity-navy-vanity-set-2.png`] },
    ],
  },
]

async function main() {
  for (const p of PRODUCTS) {
    const finishes = await Promise.all(
      p.finishes.map(async (f, i) => ({
        _key: `f${i + 1}`,
        name: f.name,
        priceModifier: 0,
        images: await imagesField(f.files, p.slug),
      }))
    )

    await client.createOrReplace({
      _type: "product",
      _id: p.id,
      name: p.name,
      slug: { current: p.slug },
      category: { _type: "reference", _ref: p.category },
      images: finishes[0]!.images,
      basePrice: p.basePrice,
      sku: p.sku,
      stockCount: 10,
      inStock: true,
      featured: false,
      material: p.material,
      description: p.description,
      careInstructions: p.careInstructions,
      tags: p.tags,
      dimensions: { width: "", height: "", depth: "", unit: "in" },
      finishes,
      variants: [],
    })

    console.log(`✓ ${p.name} (${p.slug}) — ${p.finishes.length} finish(es), Rs ${p.basePrice.toLocaleString("en-PK")}`)
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
