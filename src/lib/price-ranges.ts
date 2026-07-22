export interface PriceRange {
  slug: string
  label: string
  min: number
  max: number
}

/** Single source of truth for price brackets — used by the shop's inline
 * price filter and the standalone /shop/price browsing page, so the two
 * never drift apart. */
export const PRICE_RANGES: PriceRange[] = [
  { slug: "under-50k", label: "Under Rs 50,000", min: 0, max: 50000 },
  { slug: "50k-100k", label: "Rs 50,000 – 100,000", min: 50000, max: 100000 },
  { slug: "100k-200k", label: "Rs 100,000 – 200,000", min: 100000, max: 200000 },
  { slug: "over-200k", label: "Over Rs 200,000", min: 200000, max: Infinity },
]

export function priceInRange(price: number, range: PriceRange): boolean {
  return price >= range.min && price < range.max
}
