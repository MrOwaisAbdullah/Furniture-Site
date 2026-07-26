"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import confetti from "canvas-confetti"
import { ChevronLeft, ChevronRight, ShoppingBag, Tag } from "lucide-react"
import type { Bundle, Finish, Product } from "@/types"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/components/ui/toast"
import { trackEvent } from "@/lib/track-event"
import { formatPrice } from "@/lib/utils"
import { hexForFinishName } from "@/lib/finish-colors"
import { FinishSwatch } from "@/components/product/finish-swatch"
import { ProductCard } from "@/components/product/product-card"
import { allocateBundlePrice, resolveBundleImages, resolveBundleFinish, resolveBundleVariant } from "@/lib/bundle"

export function BundlePageClient({ bundle, decorProducts }: { bundle: Bundle; decorProducts: Product[] }) {
  const [activeFinish, setActiveFinish] = useState(0)
  const addItem = useCartStore((s) => s.addItem)
  const { toast } = useToast()
  const router = useRouter()
  const decorScrollRef = useRef<HTMLDivElement>(null)

  const finishName = bundle.finishNames[activeFinish] ?? bundle.finishNames[0] ?? ""

  const swatches: Finish[] = useMemo(
    () =>
      bundle.finishNames.map((name) => ({
        _id: name,
        name,
        colorCode: hexForFinishName(name),
        priceModifier: 0,
        images: [],
      })),
    [bundle.finishNames]
  )

  const allocated = useMemo(
    () => allocateBundlePrice(bundle.products, finishName, bundle.bundlePrice, bundle.variantOverrides),
    [bundle.products, bundle.bundlePrice, bundle.variantOverrides, finishName]
  )

  // What buying every piece would cost separately at its own price, so the
  // savings badge stays accurate if a finish/variant carries a modifier.
  const sumIfSeparate = useMemo(
    () =>
      bundle.products.reduce((sum, product) => {
        const finish = resolveBundleFinish(product, finishName)
        const variant = resolveBundleVariant(product, bundle.variantOverrides)
        return sum + (product.salePrice ?? product.basePrice) + (finish?.priceModifier ?? 0) + (variant?.priceModifier ?? 0)
      }, 0),
    [bundle.products, bundle.variantOverrides, finishName]
  )
  const savings = Math.max(0, sumIfSeparate - bundle.bundlePrice)

  // The bundle is photographed as one styled room, not per-piece — every
  // product in it shares the same photo for a given color, so the first
  // one stands in as the bundle's own hero image.
  const heroImage = bundle.products[0] ? resolveBundleImages(bundle.products[0], finishName)[0] : undefined

  function handleAddToCart() {
    for (const { product, finish, variant, price } of allocated) {
      addItem({
        productId: product._id,
        name: product.name,
        price,
        variantId: variant?._id,
        finishId: finish?._id,
        finishName: finish?.name,
        image: resolveBundleImages(product, finishName)[0],
      })
    }
    trackEvent("bundle_added", { bundleId: bundle._id, finishName, pieceCount: bundle.products.length })
    toast(`${bundle.products.length} piece${bundle.products.length !== 1 ? "s" : ""} added to cart`, "success")
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ["#C9A24B", "#16352A", "#F2EEE3"] })
    router.push("/checkout")
  }

  const scrollDecor = (dir: "left" | "right") => {
    decorScrollRef.current?.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" })
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-8">
        <div className="overflow-hidden rounded-[16px] border border-border bg-white">
          <div className="relative aspect-[4/3] w-full bg-surface-sunken sm:aspect-[16/9]">
            {heroImage && (
              <Image
                src={heroImage}
                alt={bundle.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 700px"
                priority
              />
            )}
          </div>

          <div className="p-5">
            {bundle.finishNames.length > 1 && (
              <div className="mb-5">
                <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[1px] text-sage">
                  Color — <span className="font-bold text-ink normal-case tracking-normal">{finishName}</span>
                </p>
                <FinishSwatch finishes={swatches} selected={activeFinish} onSelect={setActiveFinish} />
              </div>
            )}

            <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Pieces in this set</p>
            <ul className="flex flex-col gap-1">
              {allocated.map(({ product, variant }) => (
                <li key={product._id} className="font-body text-[13.5px] text-slate">
                  · {product.name}{variant && product.variants[0] !== variant ? ` (${variant.size})` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky price/CTA summary */}
        <aside className="overflow-hidden rounded-[16px] border border-border bg-white lg:sticky lg:top-24">
          <div className="p-4">
            {savings > 0 && (
              <div className="mb-3 flex items-center gap-1.5 rounded-[10px] bg-gold/12 px-3 py-2">
                <Tag className="h-3.5 w-3.5 shrink-0 text-gold-700" strokeWidth={2.25} />
                <p className="font-mono text-[11px] font-bold text-gold-700">
                  Bundle discount — save {formatPrice(savings)} vs buying separately
                </p>
              </div>
            )}
            <div className="flex flex-col gap-1.5 rounded-[10px] bg-surface-sunken px-3.5 py-3">
              {savings > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-[11.5px] text-sage">If bought separately</span>
                  <span className="font-mono text-[12.5px] text-sage line-through">{formatPrice(sumIfSeparate)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="font-heading font-bold text-[13.5px] text-ink">Total</span>
                <span className="font-mono font-bold text-[17px] text-forest">{formatPrice(bundle.bundlePrice)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] bg-forest py-3 font-heading font-bold text-[13.5px] text-bone transition-colors hover:bg-forest/90"
            >
              <ShoppingBag className="h-4 w-4" />
              Add bundle to cart
            </button>
          </div>
        </aside>
      </div>

      {decorProducts.length > 0 && (
        <div className="mt-14">
          <h2
            className="mb-6 font-heading font-black text-ink"
            style={{ fontSize: "clamp(18px,2.6vw,24px)", letterSpacing: "-0.5px" }}
          >
            Finish the room
          </h2>
          <div className="hidden grid-cols-4 gap-5 lg:grid">
            {decorProducts.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          <div className="relative lg:hidden">
            <button
              onClick={() => scrollDecor("left")}
              aria-label="Scroll left"
              className="absolute -left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white shadow-md text-ink transition-colors hover:bg-surface-sunken"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <div
              ref={decorScrollRef}
              className="flex gap-3 overflow-x-auto px-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {decorProducts.slice(0, 8).map((p) => (
                <div key={p._id} className="w-[200px] shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollDecor("right")}
              aria-label="Scroll right"
              className="absolute -right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white shadow-md text-ink transition-colors hover:bg-surface-sunken"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
