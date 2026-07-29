import { createClient } from "@sanity/client"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

// Load env vars from .env.local
dotenv.config({ path: path.join(__dirname, "..", ".env.local") })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"

const readClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  perspective: "published",
})

const PRODUCT_PROJECTION = `
  _id, name, "slug": slug.current,
  category->{_id, name, "slug": slug.current},
  basePrice, compareAtPrice, sku, stockCount, inStock, featured,
  "images": images[].asset->url,
  finishes[]{ _key, name, priceModifier, "images": images[].asset->url },
  variants[]{ _key, size, priceModifier },
  dimensions, material, description, careInstructions, tags,
  "_createdAt": _createdAt, "_updatedAt": _updatedAt
`

interface RawProduct {
  _id: string
  name: string
  slug: string
  category: { _id: string; name: string; slug: string } | null
  basePrice: number
  compareAtPrice?: number
  sku?: string
  stockCount: number
  inStock: boolean
  featured: boolean
  images: string[]
  finishes: {
    _key: string
    name: string
    priceModifier: number
    images: string[]
  }[]
  variants: {
    _key: string
    size: string
    priceModifier: number
  }[]
  dimensions?: { width?: string; height?: string; depth?: string; unit?: string }
  material?: string
  description?: string
  careInstructions?: string
  tags?: string[]
  _createdAt: string
  _updatedAt: string
}

function escapeCsv(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

async function main() {
  console.log("Fetching products from Sanity...")

  const products = await readClient.fetch<RawProduct[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) { ${PRODUCT_PROJECTION} }`,
    {},
    { next: { revalidate: 0 } }
  )

  console.log(`Found ${products.length} products`)

  const headers = [
    "Product Name",
    "Slug",
    "Category",
    "Base Price (PKR)",
    "Compare-at Price (PKR)",
    "SKU",
    "Stock Count",
    "In Stock",
    "Featured",
    "Material",
    "Width",
    "Height",
    "Depth",
    "Unit",
    "Description",
    "Care Instructions",
    "Tags",
    "Default Images",
    "Finishes",
    "Variants",
    "Created At",
    "Updated At",
  ]

  const rows = products.map((p) => {
    const finishNames = p.finishes?.map((f) => f.name).join("; ") ?? ""
    const variantLabels = p.variants?.map((v) => v.size).join("; ") ?? ""
    const tags = p.tags?.join(", ") ?? ""
    const defaultImages = p.images?.join(" | ") ?? ""

    return [
      escapeCsv(p.name),
      escapeCsv(p.slug),
      escapeCsv(p.category?.name ?? ""),
      escapeCsv(p.basePrice),
      escapeCsv(p.compareAtPrice ?? ""),
      escapeCsv(p.sku ?? ""),
      escapeCsv(p.stockCount ?? 0),
      escapeCsv(p.inStock ? "Yes" : "No"),
      escapeCsv(p.featured ? "Yes" : "No"),
      escapeCsv(p.material ?? ""),
      escapeCsv(p.dimensions?.width ?? ""),
      escapeCsv(p.dimensions?.height ?? ""),
      escapeCsv(p.dimensions?.depth ?? ""),
      escapeCsv(p.dimensions?.unit ?? "cm"),
      escapeCsv(p.description ?? ""),
      escapeCsv(p.careInstructions ?? ""),
      escapeCsv(tags),
      escapeCsv(defaultImages),
      escapeCsv(finishNames),
      escapeCsv(variantLabels),
      escapeCsv(p._createdAt),
      escapeCsv(p._updatedAt),
    ].join(",")
  })

  const csv = [headers.join(","), ...rows].join("\n")

  const outputDir = path.join(__dirname, "..", "docs")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const outputPath = path.join(outputDir, "AI-CHATBOT-PRODUCTS-SHEET.csv")
  fs.writeFileSync(outputPath, csv, "utf-8")

  console.log(`CSV written to: ${outputPath}`)
  console.log(`Total products: ${products.length}`)

  // Also write a JSON version for reference
  const jsonPath = path.join(outputDir, "products.json")
  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2), "utf-8")
  console.log(`JSON written to: ${jsonPath}`)
}

main().catch(console.error)
