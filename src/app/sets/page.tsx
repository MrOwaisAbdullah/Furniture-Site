import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ProductCard } from "@/components/product/product-card"
import { getFeaturedProducts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { formatPrice } from "@/lib/utils"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Bedroom Sets — Essentials, Complete or Full House",
  description:
    "Choose a bedroom set: Essentials, Complete, or Full House. Made to order in Karachi with matched finishes. Prices from Rs. 85,000.",
  openGraph: {
    title: "Bedroom Sets — Yousuf Living",
    description:
      "Choose a bedroom set: Essentials, Complete, or Full House. Made to order in Karachi.",
    url: "https://yousufliving.pk/sets",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/sets",
  },
}

const SETS_HERO = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"

const sets = [
  {
    name: "Essentials",
    slug: "essentials",
    pieces: ["Bed", "Side Tables (×2)"],
    desc: "Everything you need to sleep well. Add pieces later.",
    priceFrom: 85000,
    priceTo: 120000,
    color: "#1c4233",
  },
  {
    name: "Complete",
    slug: "complete",
    pieces: ["Bed", "Side Tables (×2)", "Dressing Table", "Stool"],
    desc: "The room looks finished the day it arrives.",
    priceFrom: 165000,
    priceTo: 220000,
    color: "#16352A",
    popular: true,
  },
  {
    name: "Full House",
    slug: "full-house",
    pieces: ["Bed", "Side Tables (×2)", "Dressing Table", "Stool", "Wardrobe (3-door)"],
    desc: "One order. One delivery. Everything matched.",
    priceFrom: 330000,
    priceTo: 420000,
    color: "#0c231b",
  },
]

export default async function SetsPage() {
  const featured = await withReviewRatings(await getFeaturedProducts())

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Sets", url: "/sets" },
        ]}
      />
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
        <Image
          src={SETS_HERO}
          alt="Bedroom sets"
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
          <p
            className="font-mono uppercase text-gold"
            style={{ fontSize: "10px", letterSpacing: "3px" }}
          >
            Bedroom sets
          </p>
          <h1
            className="mt-3 font-display leading-[1.05]"
            style={{ fontSize: "clamp(28px,7vw,50px)" }}
          >
            Choose your set.
            <br />
            <span className="italic text-gold">We build the rest.</span>
          </h1>
          <p className="mt-4 max-w-md text-[13px] leading-[1.65] text-bone/65">
            Every set is made to order in our Karachi workshop. Pick a set, choose your finish, and we deliver matched.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {/* Set cards */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
          {sets.map((set) => (
            <div
              key={set.slug}
              className="relative overflow-hidden rounded-[16px]"
              style={{ background: set.color }}
            >
              {set.popular && (
                <div className="absolute right-4 top-4 rounded-full bg-gold px-2.5 py-1 font-mono text-[9px] uppercase tracking-[1.5px] text-forest">
                  Most popular
                </div>
              )}
              <div className="flex h-full flex-col p-5">
                <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/50">
                  {set.name}
                </p>

                {/* Price range */}
                <div className="mt-4">
                  <p className="font-mono text-[9.5px] uppercase tracking-[1px] text-bone/40">Starting price</p>
                  <p className="font-mono font-bold text-gold" style={{ fontSize: "26px" }}>
                    {formatPrice(set.priceFrom)}
                  </p>
                  <p className="font-mono text-[11px] text-bone/30">
                    up to {formatPrice(set.priceTo)}
                  </p>
                </div>

                <div className="mt-4 flex flex-1 flex-col gap-2">
                  {set.pieces.map((piece) => (
                    <div key={piece} className="flex items-center gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A24B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-[13px] text-bone/80">{piece}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-[12px] leading-[1.5] text-bone/50">{set.desc}</p>

                <Link
                  href={`/sets/${set.slug}`}
                  className="mt-5 flex items-center justify-center rounded-[10px] bg-gold/15 py-3 font-heading font-bold text-[13px] text-gold transition-colors hover:bg-gold/25"
                >
                  View this set
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center font-mono text-[11px] text-slate">
          All prices include Karachi delivery · 30–50% advance confirms your build slot
        </p>

        {/* Individual pieces */}
        <div className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <h2
              className="font-heading font-black text-ink"
              style={{ fontSize: "clamp(20px,3vw,26px)", letterSpacing: "-0.4px" }}
            >
              Or browse individual pieces
            </h2>
            <Link
              href="/shop"
              className="font-heading text-[13px] font-bold text-gold-700 transition-colors hover:text-gold"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
