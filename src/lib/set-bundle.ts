import type { Product } from "@/types"
import type { CartItem } from "@/lib/store"
import { ROOM_PRIORITY, BUNDLE_CATEGORY_SLUGS } from "@/lib/recommendations"

export interface SetDiscountTier {
  minPieces: number
  pct: number
}

/**
 * The only place a set-bundle discount percentage lives. 2-3 matching
 * pieces flat at 10%, jumping at the 4th, again at the 5th — pure numbers,
 * no product data to touch when these change.
 */
export const SET_DISCOUNT_TIERS: SetDiscountTier[] = [
  { minPieces: 2, pct: 10 },
  { minPieces: 4, pct: 15 },
  { minPieces: 5, pct: 20 },
]

/** Best applicable discount for N selected pieces, plus how many more
 * pieces would unlock the next tier (drives "add 1 more to save X%"). */
export function discountForPieceCount(n: number): { pct: number; nextAt: number | null } {
  let pct = 0
  for (const tier of SET_DISCOUNT_TIERS) {
    if (n >= tier.minPieces) pct = tier.pct
  }
  const next = SET_DISCOUNT_TIERS.find((t) => t.minPieces > n)
  return { pct, nextAt: next ? next.minPieces : null }
}

/** The highest discount tier reachable by a group of this size — used for
 * "Save up to X%" badges without needing a live selection. */
export function maxDiscountForGroupSize(size: number): number {
  return discountForPieceCount(size).pct
}

function isRealSetProduct(p: Product): boolean {
  return !!p.setName && !BUNDLE_CATEGORY_SLUGS.has(p.category.slug)
}

/** Every other real product sharing this product's exact setName. */
export function getSetSiblings(product: Product, pool: Product[]): Product[] {
  if (!product.setName) return []
  return pool.filter((p) => p._id !== product._id && p.setName === product.setName && isRealSetProduct(p))
}

/** Every real product in a named set, including the given anchor if it's
 * part of that set — used by the /sets/[set] browse page, which has no
 * single fixed anchor. */
export function getSetGroup(setName: string, pool: Product[]): Product[] {
  return pool.filter((p) => p.setName === setName && isRealSetProduct(p))
}

/** All distinct real sets in the catalog, each with its member products —
 * powers the /sets list page. */
export function getSetGroups(pool: Product[]): { setName: string; products: Product[] }[] {
  const map = new Map<string, Product[]>()
  for (const p of pool) {
    if (!isRealSetProduct(p)) continue
    const arr = map.get(p.setName!) ?? []
    arr.push(p)
    map.set(p.setName!, arr)
  }
  return [...map.entries()].map(([setName, products]) => ({ setName, products }))
}

/**
 * If a real pre-built bundle SKU exists whose bundleCoversCategories is an
 * exact match for the selected pieces' categories, surface it as an
 * alternative to the computed per-piece discount — sometimes the workshop
 * genuinely has a cheaper pre-packaged SKU for a full combo.
 */
export function findBundleSku(selected: Product[], pool: Product[]): Product | null {
  if (selected.length === 0) return null
  const categories = new Set(selected.map((p) => p.category.slug))

  return pool.find((p) => {
    if (!BUNDLE_CATEGORY_SLUGS.has(p.category.slug) || !p.bundleCoversCategories) return false
    const covers = p.bundleCoversCategories
    return covers.length === categories.size && [...categories].every((c) => covers.includes(c))
  }) ?? null
}

/**
 * Color-matched cross-category upsell — separate from setName matching.
 * Finds products OUTSIDE the core room categories (i.e. future
 * "decor"/accessory categories) that offer a finish with the exact same
 * color name the customer just selected. Reuses the same 17-color
 * vocabulary the finish swatches already use, so no new color list is
 * needed. Returns [] today since no decor products exist yet — that's
 * expected, not a bug; the caller renders nothing in that case.
 */
export function getColorMatchedAccessories(
  selectedFinishName: string,
  pool: Product[],
  excludeCategorySlugs: readonly string[] = ROOM_PRIORITY
): Product[] {
  return pool.filter(
    (p) =>
      !excludeCategorySlugs.includes(p.category.slug) &&
      !BUNDLE_CATEGORY_SLUGS.has(p.category.slug) &&
      p.finishes.some((f) => f.name === selectedFinishName)
  )
}

export interface CartSetDiscount {
  setName: string
  pieceCount: number
  pct: number
  amount: number
}

/**
 * Recomputed live from whatever is actually in the cart right now — never
 * a stale snapshot taken at add-to-cart time, so removing or adding a
 * matching piece later automatically adjusts the discount. Picks the
 * largest same-setName group actually present; ties break on whichever
 * group has the higher subtotal.
 */
export function computeCartSetDiscount(cartItems: CartItem[], pool: Product[]): CartSetDiscount | null {
  const bySet = new Map<string, { qty: number; subtotal: number }>()

  for (const item of cartItems) {
    const product = pool.find((p) => p._id === item.productId)
    if (!product?.setName) continue
    const entry = bySet.get(product.setName) ?? { qty: 0, subtotal: 0 }
    entry.qty += item.quantity
    entry.subtotal += item.price * item.quantity
    bySet.set(product.setName, entry)
  }

  let best: CartSetDiscount | null = null
  for (const [setName, { qty, subtotal }] of bySet) {
    const { pct } = discountForPieceCount(qty)
    if (pct === 0) continue
    const amount = Math.round((subtotal * pct) / 100)
    if (!best || amount > best.amount) {
      best = { setName, pieceCount: qty, pct, amount }
    }
  }

  return best
}
