import type { Product, Finish } from "@/types"

/** The Finish object matching the bundle's selected color for one product,
 * falling back to the product's first finish if it doesn't offer that exact
 * name (defensive — the schema description asks admins not to let this
 * happen, but the UI shouldn't crash if it does). */
export function resolveBundleFinish(product: Product, finishName: string): Finish | undefined {
  return product.finishes.find((f) => f.name === finishName) ?? product.finishes[0]
}

/** Per-product photos for the selected color — that finish's own images if
 * it has any, else the product's default images. Same fallback the product
 * gallery already uses. */
export function resolveBundleImages(product: Product, finishName: string): string[] {
  const finish = resolveBundleFinish(product, finishName)
  return finish?.images.length ? finish.images : product.images
}

/**
 * Splits bundlePrice proportionally across products by each one's
 * finish-adjusted price ((salePrice ?? basePrice) + finish.priceModifier),
 * rounded to whole rupees, with any rounding remainder folded into the last
 * item so the parts always sum exactly to bundlePrice.
 */
export function allocateBundlePrice(
  products: Product[],
  finishName: string,
  bundlePrice: number
): { product: Product; finish: Finish | undefined; price: number }[] {
  const weighted = products.map((product) => {
    const finish = resolveBundleFinish(product, finishName)
    const weight = (product.salePrice ?? product.basePrice) + (finish?.priceModifier ?? 0)
    return { product, finish, weight }
  })

  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0)

  const allocated = weighted.map((w) => ({
    product: w.product,
    finish: w.finish,
    price: totalWeight > 0 ? Math.round((w.weight / totalWeight) * bundlePrice) : 0,
  }))

  const allocatedSum = allocated.reduce((sum, a) => sum + a.price, 0)
  const remainder = bundlePrice - allocatedSum
  const last = allocated[allocated.length - 1]
  if (remainder !== 0 && last) {
    last.price += remainder
  }

  return allocated
}
