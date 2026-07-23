"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle, Clock, MapPin, Heart, ShoppingBag,
  Minus, Plus, Trash2, ChevronLeft, ChevronRight, Info,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { ProductCard } from "@/components/product/product-card"
import { ProductGallery } from "@/components/product/product-gallery"
import { FinishSwatch } from "@/components/product/finish-swatch"
import { AuthenticityStrip } from "@/components/product/authenticity-strip"
import { SocialSignals } from "@/components/product/social-signals"
import { ShareButton } from "@/components/product/share-button"
import type { Product } from "@/types"
import { formatPrice } from "@/lib/utils"
import { WHATSAPP_NUMBER } from "@/lib/site-config"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import { wishlistClient } from "@/lib/wishlist-client"
import { flyToTarget } from "@/lib/fly-animation"
import { trackEvent } from "@/lib/track-event"
import { usePageEngagementTracking } from "@/lib/use-page-engagement-tracking"
import { ReviewForm } from "@/components/product/review-form"
import { ReviewsSection } from "@/components/product/reviews-section"
import { useToast } from "@/components/ui/toast"
import { getColorMatchedAccessories } from "@/lib/color-match"
import { recentlyViewedClient } from "@/lib/recently-viewed-client"
import { RecentlyViewed } from "@/components/product/recently-viewed"
import { ProductQA } from "@/components/product/product-qa"

const categoryTone: Record<string, string> = {
  "bedroom-sets":    "linear-gradient(150deg,#244C3C,#0c231b)",
  beds:              "linear-gradient(150deg,#3A6B57,#16352A)",
  wardrobes:         "linear-gradient(150deg,#1c3d2e,#0c231b)",
  "dressing-tables": "linear-gradient(150deg,#4A5A50,#1A2420)",
  "side-tables":     "linear-gradient(150deg,#8A9A8E,#4A5A50)",
}

export function ProductDetailClient({
  product,
  related,
  pool,
}: {
  product: Product
  related: Product[]
  pool: Product[]
}) {
  const slug = product.slug
  const [activeFinish, setActiveFinish] = useState(0)
  const [activeVariant, setActiveVariant] = useState(0)
  const [wishlisted, setWishlisted] = useState(() => wishlistClient.has(product._id))
  const [cartAdded, setCartAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [reviews, setReviews] = useState<{ id: number; name: string; rating: number; body: string; photoUrl?: string | null; createdAt: Date | string }[]>([])
  const { toast } = useToast()

  useEffect(() => {
    trackEvent("product_view", { name: product.name, categorySlug: product.category.slug, price: product.salePrice ?? product.basePrice }, { productId: product._id })
    recentlyViewedClient.add({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice ?? product.basePrice,
      image: product.images[0],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id])

  useEffect(() => {
    fetch(`/api/reviews?productSlug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => { if (data.reviews) setReviews(data.reviews) })
      .catch(() => {})
  }, [slug])

  usePageEngagementTracking(`/products/${slug}`, product._id)

  const relatedScrollRef = useRef<HTMLDivElement>(null)

  const scrollRelated = (dir: "left" | "right") => {
    relatedScrollRef.current?.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" })
  }

  const addItem = useCartStore((s) => s.addItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const cartItem = useCartStore((s) =>
    s.items.find(
      (i) =>
        i.productId === product._id &&
        (i.variantId ?? "") === (product.variants[activeVariant]?._id ?? "") &&
        (i.finishId ?? "") === (product.finishes[activeFinish]?._id ?? "")
    )
  )
  const inCart = !!cartItem

  const tone = categoryTone[product.category.slug] ?? "linear-gradient(150deg,#3A6B57,#16352A)"
  const selectedVariant = product.variants[activeVariant]
  const selectedFinish = product.finishes[activeFinish]
  // Switch the gallery to this finish's own photos, if any were uploaded
  // for it — otherwise keep showing the product's default photos.
  const galleryImages = selectedFinish?.images.length ? selectedFinish.images : product.images
  // The base (first) variant is the product's default configuration — only
  // a non-base pick (e.g. "With Mirror & Stool") needs calling out in the
  // title/cart name; the base name/price shows as-is otherwise.
  const variantSuffix = activeVariant > 0 && selectedVariant ? ` — ${selectedVariant.size}` : ""
  const displayName = `${product.name}${variantSuffix}`
  const unitPrice =
    (product.salePrice ?? product.basePrice) +
    (selectedVariant?.priceModifier ?? 0) +
    (selectedFinish?.priceModifier ?? 0)
  const price = formatPrice(unitPrice)
  // A time-limited sale takes priority over the bundle's permanent
  // compare-at price if a product somehow has both.
  const strikeThroughValue = product.salePrice
    ? product.basePrice
    : (product.compareAtPrice && product.compareAtPrice > product.basePrice ? product.compareAtPrice : null)
  const oldPrice = strikeThroughValue
    ? formatPrice(strikeThroughValue + (selectedVariant?.priceModifier ?? 0))
    : null

  const waMessage = encodeURIComponent(
    `Hi, I'm interested in the *${displayName}* (${selectedFinish?.name ?? ""})\nQty: ${qty}\nPrice: ${price}\nCan you share more details?`
  )

  const doAddToCart = (fromEl?: HTMLElement | null) => {
    const variantId = selectedVariant?._id
    const finishId = selectedFinish?._id
    addItem({
      productId: product._id,
      name: displayName,
      price: unitPrice,
      variantId,
      finishId,
      finishName: selectedFinish?.name,
    })
    if (qty > 1) updateQuantity(product._id, variantId, finishId, qty)
    if (fromEl) flyToTarget(fromEl, "[data-nav-cart]")
    trackEvent("add_to_cart", { name: displayName, price: unitPrice, qty }, { productId: product._id })
    toast(`${displayName} added to cart`, "success")
    setCartAdded(true)
    setTimeout(() => setCartAdded(false), 1800)
  }

  const handleAddToCart = (fromEl?: HTMLElement | null) => {
    const variantId = selectedVariant?._id
    const finishId = selectedFinish?._id
    if (inCart) {
      removeItem(product._id, variantId, finishId)
      return
    }
    doAddToCart(fromEl)
  }

  const colorMatchedAccessories = selectedFinish
    ? getColorMatchedAccessories(selectedFinish.name, pool, product.category.slug)
    : []

  const handleWishlist = (fromEl?: HTMLElement | null) => {
    const isNow = wishlistClient.toggle({
      productId: product._id,
      name: displayName,
      slug: product.slug,
      price: unitPrice,
      finishName: selectedFinish?.name,
      categorySlug: product.category.slug,
    })
    setWishlisted(isNow)
    if (isNow) {
      trackEvent("wishlist_add", { name: displayName }, { productId: product._id })
      toast(`${displayName} added to wishlist`, "success")
    }
    if (fromEl && isNow) flyToTarget(fromEl, "[data-nav-wishlist]", "#ef4444")
  }

  return (
    <div className="min-h-screen bg-surface pb-40 lg:pb-0">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] text-sage">
            <Link href="/" className="transition-colors hover:text-gold-700">Home</Link>
            {" / "}
            <Link href={`/shop/${product.category.slug}`} className="transition-colors hover:text-gold-700">
              {product.category.name}
            </Link>
            {" / "}
            <span className="text-ink">{product.name}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">

          {/* ── Gallery ── */}
          <div className="lg:flex-[1.15] lg:sticky lg:top-24">
            <ProductGallery
              key={selectedFinish?._id ?? "default"}
              images={galleryImages}
              name={product.name}
              tone={tone}
              onSale={!!product.salePrice}
            />
          </div>

          {/* ── Info Panel ── */}
          <div className="lg:flex-1 lg:max-w-[460px]">

            {/* Category + title */}
            <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2px" }}>
              {product.category.name}
            </p>
            <h1
              className="mt-2 font-heading font-black leading-[1.05] text-ink"
              style={{ fontSize: "clamp(24px,3.5vw,34px)", letterSpacing: "-0.8px" }}
            >
              {displayName}
            </h1>
            {selectedFinish && (
              <p className="mt-1.5 font-display italic text-forest/60" style={{ fontSize: "15px" }}>
                {selectedFinish.name} finish
              </p>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-surface-sunken px-2.5 py-1 font-mono text-[10px] font-bold text-forest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Gold rule */}
            <div className="my-5 h-px w-full bg-border" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono font-bold text-forest" style={{ fontSize: "32px", letterSpacing: "-0.5px" }}>
                {price}
              </span>
              {oldPrice && (
                <span className="font-mono text-[14px] text-sage line-through">{oldPrice}</span>
              )}
              {product.salePrice && (
                <span className="rounded-md bg-error/10 px-2 py-0.5 font-mono text-[10px] font-bold text-error">
                  SALE
                </span>
              )}
            </div>

            {/* Stock status */}
            <div
              className={cn(
                "mt-3 inline-flex items-center gap-2 rounded-[10px] px-3 py-2",
                product.inStock ? "bg-success/10" : "bg-gold/10"
              )}
            >
              {product.inStock
                ? <CheckCircle className="h-3.5 w-3.5 text-success" />
                : <Clock className="h-3.5 w-3.5 text-gold-700" />
              }
              <span className={cn("font-mono text-[11.5px] font-semibold", product.inStock ? "text-success" : "text-gold-700")}>
                {product.inStock ? "In Stock · 2-week delivery" : "Made to Order · 12–18 days"}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-5">
              {/* Finish selector */}
              {product.finishes.length > 0 && (
                <div>
                  <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[1px] text-sage">
                    Finish — <span className="font-bold text-ink normal-case tracking-normal">{selectedFinish?.name}</span>
                  </p>
                  <FinishSwatch finishes={product.finishes} selected={activeFinish} onSelect={setActiveFinish} />

                  {/* Color-matched accessories — empty until decor products exist */}
                  {selectedFinish && colorMatchedAccessories.length > 0 && (
                    <div className="mt-3.5">
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-[1px] text-sage">
                        Match the {selectedFinish.name} vibe
                      </p>
                      <div className="flex gap-2.5 overflow-x-auto">
                        {colorMatchedAccessories.slice(0, 3).map((a) => (
                          <Link
                            key={a._id}
                            href={`/products/${a.slug}`}
                            className="flex w-[110px] shrink-0 flex-col overflow-hidden rounded-[10px] border border-border"
                          >
                            <div className="relative h-[80px] w-full bg-surface-sunken">
                              {a.images[0] && (
                                <Image src={a.images[0]} alt={a.name} fill className="object-cover" sizes="110px" />
                              )}
                            </div>
                            <div className="px-2 py-1.5">
                              <p className="truncate font-heading font-bold text-[11px] text-ink">{a.name}</p>
                              <p className="font-mono text-[10.5px] text-forest">{formatPrice(a.salePrice ?? a.basePrice)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Size / configuration variant */}
              {product.variants.length > 1 && (
                <div>
                  <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Options</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v._id}
                        onClick={() => setActiveVariant(i)}
                        className={cn(
                          "rounded-[9px] border-2 px-4 py-2 font-mono text-[12px] transition-colors",
                          i === activeVariant
                            ? "border-forest bg-forest text-bone"
                            : "border-border bg-white text-slate hover:border-forest/40"
                        )}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spec table */}
              <div className="overflow-hidden rounded-[10px] border border-border bg-white">
                <div className="flex items-center gap-4 px-4 py-3">
                  <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[1px] text-sage">Dimensions</span>
                  <span className="font-mono text-[12.5px] text-ink">
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} {product.dimensions.unit}
                  </span>
                </div>
                <div className="flex items-center gap-4 border-t border-border px-4 py-3">
                  <span className="w-24 shrink-0 font-mono text-[10px] uppercase tracking-[1px] text-sage">Material</span>
                  <span className="font-mono text-[12.5px] text-ink">{product.material}</span>
                </div>
              </div>
            </div>

            {/* ── CTA block ── */}
            <div className="mt-7 flex flex-col gap-3">

              {/* Qty + primary CTA in one row */}
              <div className="flex items-center gap-2.5">
                {/* Stepper */}
                <div className="flex shrink-0 items-center overflow-hidden rounded-[10px] border border-border bg-white">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                    className="flex h-[50px] w-10 items-center justify-center text-slate transition-colors hover:bg-surface-sunken hover:text-ink disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[36px] text-center font-mono font-bold text-[15px] text-ink">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-[50px] w-10 items-center justify-center text-slate transition-colors hover:bg-surface-sunken hover:text-ink"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={(e) => handleAddToCart(e.currentTarget)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-[10px] py-[13px] font-heading font-black text-[14.5px] transition-all duration-200 active:scale-[.98]",
                    cartAdded
                      ? "bg-success text-white"
                      : inCart
                      ? "border-2 border-error/30 bg-white text-error hover:border-error/50 hover:bg-error/5"
                      : "bg-forest text-bone hover:bg-forest-700"
                  )}
                  style={{ boxShadow: (!cartAdded && !inCart) ? "0 6px 20px -8px rgba(22,53,42,.4)" : undefined }}
                >
                  {cartAdded
                    ? <><CheckCircle className="h-4.5 w-4.5" /> Added!</>
                    : inCart
                    ? <><Trash2 className="h-4.5 w-4.5" /> Remove from cart</>
                    : <><ShoppingBag className="h-4.5 w-4.5" /> Add to cart</>
                  }
                </button>
              </div>

              {/* Secondary actions — 3 equal buttons in one row */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleWishlist(e.currentTarget)}
                  aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border py-2.5 font-heading font-semibold text-[12.5px] transition-all active:scale-95",
                    wishlisted
                      ? "border-gold/40 bg-gold/8 text-gold-700"
                      : "border-border bg-white text-slate hover:border-forest/30 hover:text-ink"
                  )}
                >
                  <Heart className="h-3.5 w-3.5 shrink-0" fill={wishlisted ? "#C9A24B" : "none"} stroke={wishlisted ? "#C9A24B" : "currentColor"} strokeWidth={2} />
                  {wishlisted ? "Saved" : "Wishlist"}
                </button>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-[#25D366]/40 bg-[#25D366]/6 py-2.5 font-heading font-semibold text-[12.5px] text-[#128C7E] transition-colors hover:bg-[#25D366]/12"
                >
                  <FaWhatsapp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  WhatsApp
                </a>

                <ShareButton
                  title={product.name}
                  text={`Check out ${product.name} on Yousuf Living`}
                  url={`/products/${product.slug}`}
                  className="flex flex-1 items-center justify-center rounded-[10px] border border-border bg-white py-2.5 font-heading font-semibold text-[12.5px] text-slate transition-all hover:border-forest/30 hover:text-ink active:scale-95"
                />

              </div>

              {/* Color-variance notice — sits below the button sets rather
                  than interrupting the finish/size selection flow above. */}
              <p className="flex items-start gap-1.5 text-[11px] leading-[1.5] text-sage">
                <Info className="mt-[1px] h-3 w-3 shrink-0" />
                <span>
                  Actual color may vary slightly from photos due to screen settings.{" "}
                  <Link href="/showroom" className="font-semibold text-forest underline underline-offset-2 hover:text-forest/80">
                    Visit our showroom
                  </Link>{" "}
                  to see the real piece.
                </span>
              </p>

              {/* Showroom — text link, no box */}
              <Link
                href="/showroom"
                className="flex items-center justify-center gap-1.5 py-1 font-mono text-[11px] text-sage transition-colors hover:text-forest"
              >
                <MapPin className="h-3 w-3 shrink-0" />
                Book a showroom visit
              </Link>
            </div>

            {/* Social proof + authenticity */}
            <SocialSignals productId={product._id} className="mt-5" />
            <div className="mt-4">
              <AuthenticityStrip />
            </div>
          </div>
        </div>

        {/* ── Below fold ── */}
        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h2 className="mb-3 font-heading font-bold text-[18px] text-ink">About this piece</h2>
            <p className="text-[14.5px] leading-[1.75] text-slate">{product.description}</p>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <h3 className="mb-2 font-heading font-bold text-[15px] text-ink">Material &amp; care</h3>
            <p className="text-[13.5px] leading-[1.65] text-slate">
              {product.careInstructions} Built from 16/17 mm Lasani MDF with hand-applied deco polish.
            </p>
          </div>
          <div className="rounded-[14px] border border-border bg-white p-5">
            <h3 className="mb-2 font-heading font-bold text-[15px] text-ink">Delivery &amp; advance</h3>
            <p className="text-[13.5px] leading-[1.65] text-slate">
              A 30–50% advance confirms your build slot. Karachi delivery or showroom collection. We WhatsApp you at every stage.
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
          <ReviewForm productSlug={slug} productName={product.name} />
          <ReviewsSection
            reviews={reviews}
            averageRating={reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null}
            totalReviews={reviews.length}
          />
        </div>

        {/* Q&A */}
        <div className="mt-14">
          <ProductQA productSlug={slug} productName={product.name} />
        </div>

        <div className="mt-14">
          <h2
            className="mb-6 font-heading font-black text-ink"
            style={{ fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.6px" }}
          >
            You might also like
          </h2>
          <div className="hidden grid-cols-4 gap-5 lg:grid">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>

          {/* Mobile: arrow-navigated carousel, no scrollbar */}
          <div className="relative lg:hidden">
            <button
              onClick={() => scrollRelated("left")}
              aria-label="Scroll left"
              className="absolute -left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white shadow-md text-ink transition-colors hover:bg-surface-sunken"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>

            <div
              ref={relatedScrollRef}
              className="flex gap-3 overflow-x-auto px-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {related.map((p) => (
                <div key={p._id} className="w-[200px] shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollRelated("right")}
              aria-label="Scroll right"
              className="absolute -right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-white shadow-md text-ink transition-colors hover:bg-surface-sunken"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <RecentlyViewed excludeProductId={product._id} />
      </div>

      {/* ── Mobile sticky bar ── */}
      <div className="fixed inset-x-0 z-[45] border-t border-gold/20 bg-forest/95 px-4 pt-3 backdrop-blur-sm lg:hidden"
        style={{ bottom: "60px", paddingBottom: "12px" }}
      >
        <div className="flex items-center gap-3">
          {/* Price */}
          <div className="shrink-0">
            <p className="font-mono text-[9px] text-bone/40">Total</p>
            <p className="font-mono font-bold text-[16px] text-bone leading-none">{price}</p>
          </div>

          {/* Cart button */}
          <button
            onClick={(e) => handleAddToCart(e.currentTarget)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-[11px] py-3 font-heading font-black text-[14px] transition-all active:scale-[.97]",
              cartAdded
                ? "bg-success text-white"
                : inCart
                ? "border-2 border-white/30 bg-white/10 text-white hover:bg-white/20"
                : "bg-gold text-forest"
            )}
          >
            {cartAdded
              ? <><CheckCircle className="h-4 w-4" /> Added!</>
              : inCart
              ? <><Trash2 className="h-4 w-4" /> Remove</>
              : <><ShoppingBag className="h-4 w-4" /> Add to cart</>
            }
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask on WhatsApp"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] border border-[#25D366]/50 bg-[#25D366]/15"
          >
            <FaWhatsapp className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}
