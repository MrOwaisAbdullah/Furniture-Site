import type { Product } from "@/types"
import { getReviewSummaries } from "@/lib/neon/queries"

/**
 * Merges real approved-review averages into a product list so cards only
 * show a star rating when the product genuinely has reviews — never a
 * placeholder/default number. Products with no approved reviews keep
 * rating/reviewCount unset, which ProductCard already treats as "hide the
 * star row" (product.rating && product.reviewCount > 0).
 */
export async function withReviewRatings(products: Product[]): Promise<Product[]> {
  const summaries = await getReviewSummaries()
  return products.map((p) => {
    const summary = summaries[p.slug]
    if (!summary || summary.count === 0) return p
    return { ...p, rating: summary.avg, reviewCount: summary.count }
  })
}
