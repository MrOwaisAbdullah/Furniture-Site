/**
 * Uploads the Shaadi Season promo popup variants (A/B test) and creates the
 * promoPopup document in Sanity. Uses createOrReplace so re-running after a
 * design tweak updates the live popup instead of creating a duplicate.
 * Usage: node_modules/.bin/tsx scripts/seed-shaadi-popup.ts [variantAPath] [variantBPath]
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"
import { readFileSync } from "fs"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN!,
})

const VARIANTS = [
  {
    name: "Variant A",
    path: process.argv[2] ?? resolve(process.cwd(), ".claude/skills/carousel-routine/output/2026-07-21/yl-shadi/slide-01.png"),
    alt: "Shaadi Season — furniture your dulhan deserves. Complete bedroom sets, made to order in Karachi.",
  },
  {
    name: "Variant B",
    path: process.argv[3] ?? resolve(process.cwd(), ".claude/skills/carousel-routine/output/2026-07-21/yl-shadi-v2/slide-01.png"),
    alt: "Shaadi Season Special — complete jahez sets from Rs 190,000. Bed, side tables, dressing, wardrobe.",
  },
]

async function main() {
  const variants = []
  for (const v of VARIANTS) {
    console.log(`Uploading ${v.name}: ${v.path}...`)
    const buffer = readFileSync(v.path)
    const asset = await client.assets.upload("image", buffer, { filename: `shaadi-popup-${v.name.toLowerCase().replace(" ", "-")}.png` })
    console.log(`✓ ${v.name} uploaded: ${asset._id}`)
    variants.push({
      _type: "variant",
      _key: v.name.toLowerCase().replace(" ", "-"),
      name: v.name,
      weight: 50,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: v.alt,
      },
    })
  }

  const doc = {
    _type: "promoPopup",
    _id: "promoPopup-shaadi-season",
    title: "Shaadi Season Popup",
    variants,
    linkUrl: "/sets",
    active: true,
    delaySeconds: 4,
    maxPerSession: 1,
    cooldownDays: 7,
  }

  const result = await client.createOrReplace(doc)
  console.log(`✓ Popup published with ${variants.length} variants: ${result._id}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
