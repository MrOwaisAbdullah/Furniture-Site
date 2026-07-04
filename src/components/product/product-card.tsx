/* Hallmark · component: ProductCard · genre: editorial · theme: project-tokens
 * states: default · hover · focus · active · wishlist-toggled · cart-added
 * Image: real photo with gradient fallback · CTA bar: hover-reveal desktop, always-visible mobile
 */
"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useSyncExternalStore } from "react"
import { Heart, ShoppingBag, ShoppingCart, Star } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { cn, formatPrice } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import { wishlistClient } from "@/lib/wishlist-client"
import { flyToTarget } from "@/lib/fly-animation"
import { waLink } from "@/lib/site-config"
import { trackEvent } from "@/lib/track-event"
import type { Product } from "@/types"

const categoryToneMap: Record<string, string> = {
  "bedroom-sets":    "linear-gradient(150deg,#244C3C,#0c231b)",
  beds:              "linear-gradient(150deg,#2d5c48,#16352A)",
  wardrobes:         "linear-gradient(150deg,#1c3d2e,#0c231b)",
  "dressing-tables": "linear-gradient(150deg,#4A5A50,#1A2420)",
  "side-tables":     "linear-gradient(150deg,#8A9A8E,#4A5A50)",
}


interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const tone = categoryToneMap[product.category.slug] ?? "linear-gradient(150deg,#3A6B57,#16352A)"
  const price = formatPrice(product.salePrice ?? product.basePrice)
  const oldPrice = product.salePrice ? formatPrice(product.basePrice) : null
  const discountPct = product.salePrice ? Math.round((1 - product.salePrice / product.basePrice) * 100) : 0
  const primaryImage = product.images[0] ?? product.finishes[0]?.images[0]

  const [imgError, setImgError] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const inCart = useCartStore((s) =>
    s.items.some(
      (i) =>
        i.productId === product._id &&
        (i.variantId ?? "") === (product.variants[0]?._id ?? "") &&
        (i.finishId ?? "") === (product.finishes[0]?._id ?? "")
    )
  )

  const wished = useSyncExternalStore(
    wishlistClient.subscribe,
    () => wishlistClient.has(product._id),
    () => false,
  )

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const isNow = !wished
    if (isNow) {
      trackEvent("wishlist_add", { name: product.name }, { productId: product._id })
      flyToTarget(e.currentTarget as HTMLElement, "[data-nav-wishlist]", "#ef4444", () => {
        wishlistClient.toggle({
          productId: product._id,
          name: product.name,
          slug: product.slug,
          price: product.salePrice ?? product.basePrice,
        })
      })
    } else {
      wishlistClient.toggle({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.salePrice ?? product.basePrice,
      })
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCart) {
      removeItem(product._id, product.variants[0]?._id, product.finishes[0]?._id)
    } else {
      trackEvent("add_to_cart", { name: product.name, price: product.salePrice ?? product.basePrice, qty: 1 }, { productId: product._id })
      flyToTarget(e.currentTarget as HTMLElement, "[data-nav-cart]", "#C9A24B", () => {
        addItem({
          productId: product._id,
          name: product.name,
          price: product.salePrice ?? product.basePrice,
          variantId: product.variants[0]?._id,
          finishId: product.finishes[0]?._id,
          finishName: product.finishes[0]?.name,
        })
      })
    }
  }

  const waHref = waLink(
    `Hi, I'm interested in the *${product.name}*\nPrice: ${price}\nCan you share more details?`
  )

  return (
    <div className={cn("group relative h-full", className)}>
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 group-hover:shadow-[0_12px_36px_-10px_rgba(22,53,42,.25)] group-hover:-translate-y-0.5"
      >
        {/* Image / gradient area */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3", background: tone }}>
          {primaryImage && !imgError && (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgError(true)}
              unoptimized
            />
          )}

          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

          {/* Sale badge */}
          {product.salePrice && (
            <div className="absolute left-3 top-3 z-10 rounded-full bg-gold px-2.5 py-1 font-mono text-[8px] font-bold tracking-[1.5px] text-forest shadow-sm">
              SALE
            </div>
          )}

          {/* In-stock indicator */}
          {!product.salePrice && product.inStock && (
            <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              <span className="font-mono text-[9px] uppercase tracking-[1.5px] text-bone/90">In stock</span>
            </div>
          )}

          {/* ── CTA bar: desktop hover-reveal only ── */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] sm:flex sm:flex-col group-hover:translate-y-0 group-hover:pointer-events-auto"
            style={{ background: "linear-gradient(0deg,rgba(8,24,17,.96) 0%,rgba(20,48,36,.88) 100%)" }}
          >
            <div className="flex items-stretch divide-x divide-white/10">
              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                className="flex flex-1 flex-col items-center gap-1 py-3.5 transition-colors hover:bg-white/8 focus-visible:bg-white/10"
              >
                <Heart
                  className={cn("h-4 w-4 transition-transform hover:scale-110", wished ? "fill-error stroke-error" : "stroke-bone/80")}
                  strokeWidth={2}
                />
                <span className="font-mono text-[8px] uppercase tracking-[1px] text-bone/50">
                  {wished ? "Saved" : "Wish"}
                </span>
              </button>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                aria-label={inCart ? "Remove from cart" : "Add to cart"}
                className="flex flex-1 flex-col items-center gap-1 py-3.5 transition-colors hover:bg-white/8 focus-visible:bg-white/10"
              >
                <ShoppingBag
                  className={cn("h-4 w-4 transition-transform hover:scale-110", inCart ? "stroke-gold" : "stroke-bone/80")}
                  strokeWidth={2}
                />
                <span className={cn("font-mono text-[8px] uppercase tracking-[1px]", inCart ? "text-gold" : "text-bone/50")}>
                  {inCart ? "In cart" : "Cart"}
                </span>
              </button>

              {/* WhatsApp */}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="Enquire on WhatsApp"
                className="flex flex-1 flex-col items-center gap-1 py-3.5 transition-colors hover:bg-white/8 focus-visible:bg-white/10"
              >
                <FaWhatsapp className="h-4 w-4 text-bone/80 transition-transform hover:scale-110" aria-hidden="true" />
                <span className="font-mono text-[8px] uppercase tracking-[1px] text-bone/50">Ask</span>
              </a>

              {/* Buy now */}
              <Link
                href={`/checkout?product=${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                aria-label="Buy now"
                className="flex flex-1 flex-col items-center gap-1 bg-gold/15 py-3.5 transition-colors hover:bg-gold/28 focus-visible:bg-gold/30"
              >
                <ShoppingCart className="h-4 w-4 stroke-gold transition-transform hover:scale-110" strokeWidth={2} aria-hidden="true" />
                <span className="font-mono text-[8px] uppercase tracking-[1px] text-gold/80">Buy now</span>
              </Link>
            </div>
          </div>

          {/* Wishlist heart — always visible on mobile, fades on desktop hover */}
          <button
            onClick={handleWishlist}
            aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all duration-200 sm:group-hover:opacity-0"
          >
            <Heart className={cn("h-3.5 w-3.5", wished ? "fill-error stroke-error" : "stroke-white")} strokeWidth={2} />
          </button>
        </div>

        {/* Card info row */}
        <div className="flex flex-1 flex-col px-2.5 py-2.5 sm:px-[18px] sm:py-4">
          <p className="font-mono uppercase text-gold-700" style={{ fontSize: "8px", letterSpacing: "1.2px" }}>
            {product.category.name}
          </p>
          {/* Star rating */}
          {product.rating && product.reviewCount && product.reviewCount > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-2.5 w-2.5",
                      i < Math.round(product.rating!) ? "fill-gold text-gold" : "fill-mist text-mist"
                    )}
                  />
                ))}
              </div>
              <span className="font-mono text-[8px] text-sage">({product.reviewCount})</span>
            </div>
          )}
          <h3
            className="mt-1 flex-1 font-heading font-bold leading-[1.2] text-ink transition-colors group-hover:text-forest text-[13px] sm:text-[15.5px] sm:mt-1.5 sm:leading-[1.15]"
            style={{ letterSpacing: "-0.2px" }}
          >
            {product.name}
          </h3>

          <div className="mt-2 sm:mt-3">
            {/* Price row */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-mono font-bold text-forest text-[13px] sm:text-[15px]">
                {price}
              </span>
              {oldPrice && (
                <span className="font-mono text-[10px] text-sage/70 line-through">{oldPrice}</span>
              )}
              {discountPct > 0 && (
                <span className="rounded-sm bg-error/10 px-1 py-0.5 font-mono text-[7.5px] font-bold text-error">
                  -{discountPct}%
                </span>
              )}
            </div>
            {/* Finish swatches */}
            <div className="mt-1.5 flex gap-1 sm:mt-2">
              {product.finishes.slice(0, 4).map((f) => (
                <div
                  key={f._id}
                  className="h-3 w-3 rounded-full border border-black/10 sm:h-3.5 sm:w-3.5"
                  style={{ background: f.colorCode }}
                  title={f.name}
                />
              ))}
              {product.finishes.length > 4 && (
                <span className="self-center font-mono text-[8px] text-sage">+{product.finishes.length - 4}</span>
              )}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-sunken px-2 py-0.5 font-mono text-[7.5px] text-sage"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Mobile-only: Add to cart button below price */}
            <button
              onClick={handleAddToCart}
              aria-label={inCart ? "In cart" : "Add to cart"}
              className={cn(
                "mt-2 flex w-full items-center justify-center gap-1.5 rounded-[8px] py-1.5 font-heading font-bold text-[11px] transition-colors sm:hidden",
                inCart
                  ? "bg-forest/10 text-forest"
                  : "bg-forest text-bone hover:bg-forest/90"
              )}
            >
              <ShoppingBag className="h-3 w-3" strokeWidth={2.5} />
              {inCart ? "In cart" : "Add to cart"}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export function ProductCardCompact({ product }: ProductCardProps) {
  const tone = categoryToneMap[product.category.slug] ?? "linear-gradient(150deg,#3A6B57,#16352A)"
  const price = formatPrice(product.salePrice ?? product.basePrice)
  const primaryImage = product.images[0]
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block w-36 shrink-0 overflow-hidden rounded-[13px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[.98]"
    >
      <div
        className="relative h-24 overflow-hidden"
        style={{ background: tone }}
      >
        {primaryImage && !imgError && (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-400 group-hover:scale-105"
            sizes="144px"
            onError={() => setImgError(true)}
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>
      <div className="p-2.5">
        <p className="font-heading font-bold leading-[1.1] text-ink transition-colors group-hover:text-forest" style={{ fontSize: "12.5px" }}>
          {product.name}
        </p>
        <p className="mt-1.5 font-mono font-bold text-forest" style={{ fontSize: "11.5px" }}>
          {price}
        </p>
      </div>
    </Link>
  )
}
