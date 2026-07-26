/**
 * Oval Vanity's finish is still named "Offwhite" in live data — everything
 * else already normalized to "White". No image changes, just the name.
 * Run:
 *   npx tsx scripts/fix-oval-vanity-color-name.ts
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn:    false,
  token:     process.env.SANITY_API_WRITE_TOKEN!,
})

async function main() {
  const product = await client.fetch<{ finishes: { _key: string; name: string }[] } | null>(
    `*[_id == "product-oval-vanity"][0]{ finishes[]{_key, name} }`
  )
  const offwhite = product?.finishes.find((f) => f.name === "Offwhite")
  if (!offwhite) {
    console.log("No 'Offwhite' finish found — already fixed or renamed.")
    return
  }

  await client
    .patch("product-oval-vanity")
    .set({ [`finishes[_key=="${offwhite._key}"].name`]: "White" })
    .commit()

  console.log(`✓ Renamed finish ${offwhite._key} from "Offwhite" to "White" on product-oval-vanity`)
}

main().catch((err) => { console.error(err); process.exit(1) })
