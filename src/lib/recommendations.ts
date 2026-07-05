import type { Product } from "@/types"
import type { CartItem } from "@/lib/store"

// Priority order for "how central this category is to completing a
// bedroom." A category NOT in this list (e.g. a future "decor" slug) isn't
// excluded — it just sorts last by default. That's the entire mechanism for
// new categories showing up in suggestions automatically: add "decor" here
// (or leave it out and it still appears, just lowest-priority) once decor
// products exist — no other code changes needed.
export const ROOM_PRIORITY = ["beds", "wardrobes", "dressing-tables", "side-tables"] as const

// Full-set products (category itself) are never suggested as a small add-on
// — you don't upsell "add the whole set" on top of the set.
export const BUNDLE_CATEGORY_SLUGS = new Set(["bedroom-sets"])

// The categories the "Complete the room" tier upsell is shown on, per spec —
// individual pieces, not the side-table pair (too small to anchor a bundle)
// and not bedroom-sets (already the complete package).
export const ANCHOR_CATEGORIES = ["beds", "wardrobes", "dressing-tables"]

function priorityIndex(slug: string): number {
  const i = (ROOM_PRIORITY as readonly string[]).indexOf(slug)
  return i === -1 ? ROOM_PRIORITY.length : i
}

function representativePrice(p: Product): number {
  return p.salePrice ?? p.basePrice
}

function sharedTagCount(a: Product, tags: Set<string>): number {
  return a.tags.filter((t) => tags.has(t)).length
}

/**
 * Shared gap-filling walk used by both getRelatedProducts and
 * getCheckoutUpsells: given what's already "present" (by category),
 * find real, differently-categorized products that would fill the room,
 * falling back to same-category alternates only if still short of `limit`.
 * Never pads with irrelevant items just to hit a count.
 */
function pickGapFillers(
  pool: Product[],
  excludeIds: Set<string>,
  presentCategories: Set<string>,
  tieBreakTags: Set<string>,
  limit: number
): Product[] {
  const candidates = pool.filter(
    (p) => !excludeIds.has(p._id) && !BUNDLE_CATEGORY_SLUGS.has(p.category.slug)
  )

  const gaps: Product[] = []
  const alternates: Product[] = []
  for (const p of candidates) {
    if (presentCategories.has(p.category.slug)) alternates.push(p)
    else gaps.push(p)
  }

  const sortFn = (a: Product, b: Product) => {
    const byPriority = priorityIndex(a.category.slug) - priorityIndex(b.category.slug)
    if (byPriority !== 0) return byPriority
    const byTags = sharedTagCount(b, tieBreakTags) - sharedTagCount(a, tieBreakTags)
    if (byTags !== 0) return byTags
    return (b.rating ?? 0) - (a.rating ?? 0)
  }

  gaps.sort(sortFn)
  alternates.sort(sortFn)

  const result: Product[] = []
  const usedCategories = new Set<string>()

  for (const p of gaps) {
    if (result.length >= limit) break
    if (usedCategories.has(p.category.slug)) continue
    result.push(p)
    usedCategories.add(p.category.slug)
  }

  if (result.length < limit) {
    for (const p of alternates) {
      if (result.length >= limit) break
      result.push(p)
    }
  }

  return result
}

/** Product detail page "You might also like" — genuinely related items,
 * not "everything else, first N." */
export function getRelatedProducts(product: Product, pool: Product[], limit = 4): Product[] {
  const excludeIds = new Set([product._id])
  const presentCategories = new Set(product.bundleCoversCategories ?? [product.category.slug])
  const tieBreakTags = new Set(product.tags)

  const gapFillers = pickGapFillers(pool, excludeIds, presentCategories, tieBreakTags, limit)
  if (gapFillers.length > 0) return gapFillers

  // A bundle's own page has no gaps (it already covers everything) — fall
  // back to showing its component pieces ("or build it piece by piece")
  // so this section is never empty on the one page where gap-fill yields
  // nothing.
  if (product.bundleCoversCategories?.length) {
    return pool
      .filter((p) => p._id !== product._id && product.bundleCoversCategories!.includes(p.category.slug))
      .sort((a, b) => priorityIndex(a.category.slug) - priorityIndex(b.category.slug))
      .slice(0, limit)
  }

  return []
}

/** Checkout-time upsell — resolves cart line items to real products, and
 * suggests 1-3 (never padded) products that would fill a genuine gap.
 * Returns [] if every room-priority category is already covered. */
export function getCheckoutUpsells(cartItems: CartItem[], pool: Product[], limit = 3): Product[] {
  const resolved = cartItems
    .map((item) => pool.find((p) => p._id === item.productId))
    .filter((p): p is Product => !!p)

  if (resolved.length === 0) return []

  const excludeIds = new Set(resolved.map((p) => p._id))
  const presentCategories = new Set<string>()
  for (const p of resolved) {
    presentCategories.add(p.category.slug)
    for (const c of p.bundleCoversCategories ?? []) presentCategories.add(c)
  }

  const roomComplete = ROOM_PRIORITY.every((slug) => presentCategories.has(slug))
  if (roomComplete) return []

  const tieBreakTags = new Set(resolved.flatMap((p) => p.tags))
  return pickGapFillers(pool, excludeIds, presentCategories, tieBreakTags, limit)
}

export interface RoomTier {
  key: "tier1" | "tier2" | "tier3"
  name: string
  tagline: string
  price: number
  savings: number | null
  badge: string | null
  highlight: boolean
  components: Product[]
  pieces: { included: boolean; text: string }[]
}

/**
 * "Complete the room" bundle tiers, priced from the cost-sheet-derived
 * `pricing` map (category slug -> real sell price from resolveProductCost),
 * falling back to that category's representative product's own
 * salePrice/basePrice only when the cost sheet has no data for it yet.
 * Every price here is a real number or a plain sum of real numbers —
 * never invented.
 */
export function buildRoomTiers(
  anchor: Product,
  pool: Product[],
  pricing: Record<string, number>
): RoomTier[] {
  const representativeFor = (categorySlug: string): Product | null =>
    pool
      .filter((p) => p.category.slug === categorySlug && !BUNDLE_CATEGORY_SLUGS.has(p.category.slug))
      .sort((a, b) => representativePrice(a) - representativePrice(b))[0] ?? null

  const priceFor = (categorySlug: string, rep: Product | null): number | null => {
    if (pricing[categorySlug] != null) return pricing[categorySlug]
    return rep ? representativePrice(rep) : null
  }

  const anchorPrice = pricing[anchor.category.slug] ?? representativePrice(anchor)

  const remaining = ROOM_PRIORITY
    .filter((slug) => slug !== anchor.category.slug)
    .map((slug) => {
      const rep = representativeFor(slug)
      return { slug, product: rep, price: priceFor(slug, rep) }
    })
    .filter((r): r is { slug: (typeof ROOM_PRIORITY)[number]; product: Product; price: number } => r.product != null && r.price != null)
    .sort((a, b) => a.price - b.price)

  if (remaining.length === 0) return []

  function buildPieceRows(includeCount: number) {
    const rows = [{ included: true, text: anchor.name }]
    remaining.forEach((g, i) => {
      rows.push({ included: i < includeCount, text: g.product.name })
    })
    return rows
  }

  const tiers: RoomTier[] = []

  // Tier 1: anchor + cheapest gap
  const gap1 = remaining[0]!
  tiers.push({
    key: "tier1",
    name: `${anchor.category.name} + ${gap1.product.name}`,
    tagline: `${anchor.category.name} + ${gap1.product.name}`,
    price: anchorPrice + gap1.price,
    savings: null,
    badge: null,
    highlight: false,
    components: [anchor, gap1.product],
    pieces: buildPieceRows(1),
  })

  // Tier 2: + next gap (only if a second gap exists)
  if (remaining.length >= 2) {
    const gap2 = remaining[1]!
    tiers.push({
      key: "tier2",
      name: "Bedroom Set",
      tagline: `+ ${gap2.product.name}`,
      price: anchorPrice + gap1.price + gap2.price,
      savings: null,
      badge: "Most popular",
      highlight: false,
      components: [anchor, gap1.product, gap2.product],
      pieces: buildPieceRows(2),
    })
  }

  // Tier 3: a real bundle SKU covering everything, or a plain sum of all
  // remaining components if no such SKU exists yet.
  const fullCoverage = new Set([anchor.category.slug, ...remaining.map((r) => r.slug)])
  const bundleSku = pool.find(
    (p) =>
      BUNDLE_CATEGORY_SLUGS.has(p.category.slug) &&
      p.bundleCoversCategories &&
      [...fullCoverage].every((slug) => p.bundleCoversCategories!.includes(slug))
  )

  if (bundleSku) {
    const partsTotal = anchorPrice + remaining.reduce((sum, r) => sum + r.price, 0)
    const bundlePrice = representativePrice(bundleSku)
    tiers.push({
      key: "tier3",
      name: "Full Bedroom",
      tagline: "Everything — every piece, one delivery",
      price: bundlePrice,
      savings: partsTotal > bundlePrice ? partsTotal - bundlePrice : null,
      badge: "Best value",
      highlight: true,
      components: [bundleSku],
      pieces: buildPieceRows(remaining.length),
    })
  } else if (remaining.length >= 2) {
    const t3Price = anchorPrice + remaining.reduce((sum, r) => sum + r.price, 0)
    tiers.push({
      key: "tier3",
      name: "Full Bedroom",
      tagline: "Everything — every piece, one delivery",
      price: t3Price,
      savings: null,
      badge: "Best value",
      highlight: true,
      components: [anchor, ...remaining.map((r) => r.product)],
      pieces: buildPieceRows(remaining.length),
    })
  }

  return tiers
}
