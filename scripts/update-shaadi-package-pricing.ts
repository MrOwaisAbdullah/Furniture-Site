/**
 * Repositions the existing "Full Bedroom Set" bundle SKU as the "Shaadi
 * Package" per docs/yousuf-living-website-spec.md's pricing decision:
 * Rs 235,000 if bought separately, Rs 211,500 as a complete set (10% off,
 * save Rs 23,500). Keeps the same _id/bundleCoversCategories so it keeps
 * showing up in getRelatedProducts()/getCheckoutUpsells() wherever it
 * already did.
 * Usage: node_modules/.bin/tsx scripts/update-shaadi-package-pricing.ts
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN!,
})

async function main() {
  const result = await client
    .patch("product-full-bedroom-set")
    .set({
      name: "Shaadi Package",
      slug: { current: "shaadi-package" },
      basePrice: 211500,
      compareAtPrice: 235000,
      sku: "SET-SHAADI-01",
      description:
        "Complete Shaadi/Jahez bedroom package: bed, 2 side tables, dressing table, and 3-door wardrobe. Bought separately these run Rs 235,000 — booked together as a set, Rs 211,500. Save Rs 23,500.",
      tags: ["shaadi", "jahez", "bedroom set", "complete", "best value"],
    })
    .commit()

  console.log(`Updated: ${result._id} → "${result.name}" — Rs ${result.basePrice} (was Rs ${result.compareAtPrice})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
