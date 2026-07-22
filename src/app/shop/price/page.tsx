import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { PRICE_RANGES, priceInRange } from "@/lib/price-ranges"
import { formatPrice } from "@/lib/utils"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Shop by Budget",
  description: "Browse Yousuf Living furniture by price range — find pieces that fit your budget.",
  openGraph: {
    title: "Shop by Budget — Yousuf Living",
    description: "Browse furniture by price range — find pieces that fit your budget.",
    url: "https://yousufliving.pk/shop/price",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/shop/price",
  },
}

const PRICE_HERO = "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"

export default async function ShopByPricePage() {
  const products = await withReviewRatings(await getProducts())

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: "Shop by budget", url: "/shop/price" },
        ]}
      />
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
        <Image
          src={PRICE_HERO}
          alt="Shop furniture by budget"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg,rgba(10,28,21,.92) 0%,rgba(22,53,42,.78) 55%,rgba(22,53,42,.5) 100%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-10 text-bone sm:px-8 sm:pt-14 lg:px-14">
          <p className="font-mono uppercase text-gold" style={{ fontSize: "10px", letterSpacing: "3px" }}>
            Shop by budget
          </p>
          <h1 className="mt-3 font-display leading-[1.05]" style={{ fontSize: "clamp(28px,7vw,50px)" }}>
            Find furniture
            <br />
            <span className="italic text-gold">that fits your budget.</span>
          </h1>
          <p className="mt-4 max-w-md text-[13px] leading-[1.65] text-bone/65">
            Pick a range below to see what&rsquo;s available at that price point — no need to guess and filter.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRICE_RANGES.map((range) => {
            const inRange = products.filter((p) => priceInRange(p.salePrice ?? p.basePrice, range))
            const thumb = inRange.find((p) => p.images[0])?.images[0]

            return (
              <Link
                key={range.slug}
                href={`/shop/price/${range.slug}`}
                className="group overflow-hidden rounded-[16px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(22,53,42,.18)]"
              >
                <div className="relative h-[140px] w-full bg-surface-sunken">
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={range.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-heading font-bold text-[15px] text-ink">{range.label}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-sage">
                    {inRange.length} item{inRange.length !== 1 ? "s" : ""}
                  </p>
                  {inRange.length > 0 && (
                    <p className="mt-1.5 font-mono text-[13px] text-forest">
                      From {formatPrice(Math.min(...inRange.map((p) => p.salePrice ?? p.basePrice)))}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
