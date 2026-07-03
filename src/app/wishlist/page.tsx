"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { wishlistClient, type WishlistItem } from "@/lib/wishlist-client"
import { sampleProducts } from "@/data/sample-products"
import { WishlistEmptyState } from "@/components/wishlist/empty-state"
import { WhatsAppAll } from "@/components/wishlist/whatsapp-all"
import { ShareWishlist } from "@/components/wishlist/share-wishlist"

const categoryTone: Record<string, string> = {
  "bedroom-sets":    "linear-gradient(150deg,#244C3C,#0c231b)",
  beds:              "linear-gradient(150deg,#3A6B57,#16352A)",
  wardrobes:         "linear-gradient(150deg,#1c3d2e,#0c231b)",
  "dressing-tables": "linear-gradient(150deg,#4A5A50,#1A2420)",
  "side-tables":     "linear-gradient(150deg,#8A9A8E,#4A5A50)",
}

function getSavedItems(): WishlistItem[] {
  const saved = wishlistClient.getAll()
  if (saved.length > 0) return saved
  // Seed with first 3 sample products as demo when localStorage is empty
  return sampleProducts.slice(0, 3).map((p) => ({
    productId: p._id,
    name: p.name,
    slug: p.slug,
    price: p.salePrice ?? p.basePrice,
    finishName: p.finishes[0]?.name,
  }))
}

function getProductTone(slug: string): string {
  const product = sampleProducts.find((p) => p.slug === slug)
  return categoryTone[product?.category.slug ?? ""] ?? "linear-gradient(150deg,#3A6B57,#16352A)"
}

export default function WishlistPage() {
  const items = useSyncExternalStore(
    wishlistClient.subscribe,
    getSavedItems,
    () => [] as WishlistItem[],
  )

  const remove = (productId: string) => {
    wishlistClient.remove(productId)
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h1 className="font-heading font-black text-[26px] text-ink" style={{ letterSpacing: "-0.6px" }}>
            Wishlist
          </h1>
          {items.length > 0 && (
            <span className="font-mono text-[11px] text-sage">{items.length} saved</span>
          )}
        </div>

        {items.length === 0 ? (
          <WishlistEmptyState />
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-3">
              {items.map((item) => {
                const tone = getProductTone(item.slug)
                return (
                  <div
                    key={item.productId}
                    className="group flex items-center gap-3 rounded-[13px] border border-border bg-white p-3 transition-shadow hover:shadow-sm"
                  >
                    <Link href={`/products/${item.slug}`} className="flex flex-1 items-center gap-3 min-w-0">
                      <div className="h-[72px] w-[72px] shrink-0 rounded-[10px]" style={{ background: tone }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-[14px] text-ink leading-[1.15] truncate">{item.name}</p>
                        {item.finishName && (
                          <p className="mt-0.5 text-[11px] text-sage">{item.finishName} · Lasani</p>
                        )}
                        <p className="mt-2 font-mono font-bold text-[14px] text-forest">{formatPrice(item.price)}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => remove(item.productId)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sage opacity-0 transition-all group-hover:opacity-100 hover:bg-error/10 hover:text-error"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <WhatsAppAll items={items} />
              <ShareWishlist items={items} />
            </div>

            <div className="mt-5 rounded-[13px] border border-border/60 bg-white p-4">
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 stroke-forest/50" strokeWidth={2} />
                <p className="text-[12.5px] text-slate">
                  Your wishlist is saved on this device. Share the link to let others see it.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
