import { NextResponse } from "next/server"
import { resolveProductCost } from "@/lib/neon/queries"
import { sampleProducts } from "@/data/sample-products"
import { ROOM_PRIORITY } from "@/lib/recommendations"

// Public — deliberately returns only the computed sell price (wholesaleCost)
// per category, never the manufacturing cost or margin % breakdown that
// power it. Those stay admin-only (/admin/costs). Used by the storefront's
// "Complete the room" bundle pricing so it matches the cost sheet instead of
// the sample catalog's placeholder retail prices.
export async function GET() {
  const categorySlugs = [...ROOM_PRIORITY, "bedroom-sets"]

  try {
    const entries = await Promise.all(
      categorySlugs.map(async (categorySlug) => {
        const representative = sampleProducts.find((p) => p.category.slug === categorySlug)
        if (!representative) return [categorySlug, null] as const

        const resolved = await resolveProductCost(representative.slug, categorySlug)
        return [categorySlug, resolved?.wholesaleCost ?? null] as const
      })
    )

    const pricing: Record<string, number> = {}
    for (const [slug, price] of entries) {
      if (price != null) pricing[slug] = price
    }

    return NextResponse.json({ pricing })
  } catch (err) {
    console.error("[pricing/room-tiers] error", err)
    // Cost sheet unreachable — return empty, the storefront falls back to
    // catalog basePrice/salePrice per component rather than breaking.
    return NextResponse.json({ pricing: {} })
  }
}
