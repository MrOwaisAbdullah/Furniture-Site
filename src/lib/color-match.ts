import type { Product } from "@/types"
import { BUNDLE_CATEGORY_SLUGS } from "@/lib/recommendations"

/**
 * Color-matched cross-category upsell. Finds products in any OTHER category
 * (so a bed page doesn't recommend other beds) that offer a finish with the
 * exact same color name the customer just selected — a bed can match with
 * any color-coordinated side table, dressing table, wardrobe, or decor
 * piece, not just a curated set. Reuses the same finish-color vocabulary
 * the swatches already use, so no new color list is needed.
 */
export function getColorMatchedAccessories(
  selectedFinishName: string,
  pool: Product[],
  excludeCategorySlug: string
): Product[] {
  return pool.filter(
    (p) =>
      p.category.slug !== excludeCategorySlug &&
      !BUNDLE_CATEGORY_SLUGS.has(p.category.slug) &&
      p.finishes.some((f) => f.name === selectedFinishName)
  )
}
