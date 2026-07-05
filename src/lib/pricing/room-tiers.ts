import type { Product } from "@/types"
import { resolveProductCost } from "@/lib/neon/queries"
import { ROOM_PRIORITY } from "@/lib/recommendations"

/**
 * Cost-sheet-derived sell price per room category, used to price bundle
 * tiers ("Complete the room") so they match the real cost sheet instead of
 * catalog placeholder prices. Deliberately returns only the computed sell
 * price (wholesaleCost), never manufacturing cost or margin % — those stay
 * admin-only (/admin/costs).
 */
export async function getRoomTierPricing(products: Product[]): Promise<Record<string, number>> {
  const categorySlugs = [...ROOM_PRIORITY, "bedroom-sets"]

  try {
    const entries = await Promise.all(
      categorySlugs.map(async (categorySlug) => {
        const representative = products.find((p) => p.category.slug === categorySlug)
        if (!representative) return [categorySlug, null] as const

        const resolved = await resolveProductCost(representative.slug, categorySlug)
        return [categorySlug, resolved?.wholesaleCost ?? null] as const
      })
    )

    const pricing: Record<string, number> = {}
    for (const [slug, price] of entries) {
      if (price != null) pricing[slug] = price
    }
    return pricing
  } catch (err) {
    console.error("[room-tiers] pricing resolution error", err)
    // Cost sheet unreachable — return empty, callers fall back to catalog
    // basePrice/salePrice per component rather than breaking.
    return {}
  }
}
