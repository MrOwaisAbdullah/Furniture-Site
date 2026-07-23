"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import confetti from "canvas-confetti"
import { ShoppingBag } from "lucide-react"
import type { Bundle, Finish } from "@/types"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/components/ui/toast"
import { trackEvent } from "@/lib/track-event"
import { formatPrice } from "@/lib/utils"
import { hexForFinishName } from "@/lib/finish-colors"
import { FinishSwatch } from "@/components/product/finish-swatch"
import { allocateBundlePrice, resolveBundleImages } from "@/lib/bundle"

export function BundlePageClient({ bundle }: { bundle: Bundle }) {
  const [activeFinish, setActiveFinish] = useState(0)
  const addItem = useCartStore((s) => s.addItem)
  const { toast } = useToast()
  const router = useRouter()

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
    () => allocateBundlePrice(bundle.products, finishName, bundle.bundlePrice),
    [bundle.products, bundle.bundlePrice, finishName]
  )

  function handleAddToCart() {
    for (const { product, finish, price } of allocated) {
      addItem({
        productId: product._id,
        name: product.name,
        price,
        variantId: product.variants[0]?._id,
        finishId: finish?._id,
        finishName: finish?.name,
      })
    }
    trackEvent("bundle_added", { bundleId: bundle._id, finishName, pieceCount: bundle.products.length })
    toast(`${bundle.products.length} piece${bundle.products.length !== 1 ? "s" : ""} added to cart`, "success")
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ["#C9A24B", "#16352A", "#F2EEE3"] })
    router.push("/checkout")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start lg:gap-8">
      <div className="overflow-hidden rounded-[16px] border border-border bg-white">
        <div className="px-5 py-4" style={{ background: "linear-gradient(135deg,#16352A,#0c231b)" }}>
          <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-gold/70">This bundle includes</p>
          <p className="mt-0.5 font-heading font-black text-[16px] leading-snug text-bone">
            {bundle.products.length} pieces, one price
          </p>
        </div>

        <div className="p-4">
          {bundle.finishNames.length > 1 && (
            <div className="mb-4">
              <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[1px] text-sage">
                Color — <span className="font-bold text-ink normal-case tracking-normal">{finishName}</span>
              </p>
              <FinishSwatch finishes={swatches} selected={activeFinish} onSelect={setActiveFinish} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {allocated.map(({ product, price }) => {
              const image = resolveBundleImages(product, finishName)[0]
              return (
                <div key={product._id} className="flex flex-col overflow-hidden rounded-[12px] border border-border">
                  <div className="relative h-[120px] w-full bg-surface-sunken">
                    {image && <Image src={image} alt={product.name} fill className="object-cover" sizes="180px" />}
                  </div>
                  <div className="flex flex-1 flex-col px-2.5 py-2.5">
                    {product.category?.name && (
                      <p className="font-mono text-[8.5px] uppercase tracking-[1px] text-sage">{product.category.name}</p>
                    )}
                    <p className="mt-0.5 font-heading font-bold text-[12.5px] leading-[1.25] text-ink truncate">{product.name}</p>
                    <p className="mt-1 font-mono text-[11.5px] font-bold text-forest">{formatPrice(price)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky price/CTA summary */}
      <aside className="overflow-hidden rounded-[16px] border border-border bg-white lg:sticky lg:top-24">
        <div className="p-4">
          <div className="flex flex-col gap-1.5 rounded-[10px] bg-surface-sunken px-3.5 py-3">
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
  )
}
