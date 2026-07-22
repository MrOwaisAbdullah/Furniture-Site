import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { getSetGroups, maxDiscountForGroupSize } from "@/lib/set-bundle"
import { formatPrice, slugify } from "@/lib/utils"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Matching Sets",
  description:
    "Browse our matching bedroom collections — pick the pieces you want from a real design family and save more the more you take.",
  openGraph: {
    title: "Matching Sets — Yousuf Living",
    description: "Browse our matching bedroom collections and save more the more you take.",
    url: "https://yousufliving.pk/sets",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/sets",
  },
}

const SETS_HERO = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"

export default async function SetsPage() {
  const products = await withReviewRatings(await getProducts())
  const groups = getSetGroups(products)

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
          alt="Matching bedroom sets"
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
            Matching sets
          </p>
          <h1 className="mt-3 font-display leading-[1.05]" style={{ fontSize: "clamp(28px,7vw,50px)" }}>
            Real collections.
            <br />
            <span className="italic text-gold">Pick what you want.</span>
          </h1>
          <p className="mt-4 max-w-md text-[13px] leading-[1.65] text-bone/65">
            Every set below is a real matching family from our workshop — take a piece or two, or the whole room, and save more the more you take.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {groups.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-heading font-bold text-[17px] text-ink">No matching sets yet</p>
            <p className="mt-2 text-[13px] text-slate">Check back soon, or browse individual pieces in the shop.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ setName, products: pieces }) => {
              const cheapest = Math.min(...pieces.map((p) => p.salePrice ?? p.basePrice))
              const savePct = maxDiscountForGroupSize(pieces.length)
              const thumb = pieces.find((p) => p.images[0])?.images[0]

              return (
                <Link
                  key={setName}
                  href={`/sets/${slugify(setName)}`}
                  className="group overflow-hidden rounded-[16px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(22,53,42,.18)]"
                >
                  <div className="relative h-[160px] w-full bg-surface-sunken">
                    {thumb && (
                      <Image
                        src={thumb}
                        alt={setName}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    {savePct > 0 && (
                      <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[1px] text-forest">
                        Save up to {savePct}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-bold text-[15px] text-ink">{setName}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-sage">
                      {pieces.length} item{pieces.length !== 1 ? "s" : ""}
                    </p>
                    <p className="mt-1.5 font-mono text-[13px] text-forest">From {formatPrice(cheapest)}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
