import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { getProducts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { formatPrice } from "@/lib/utils"
import { waLink } from "@/lib/site-config"

const SET_MAP = {
  "essentials": {
    label: "Essentials",
    tagline: "Everything you need to sleep well.",
    desc: "The Essentials set gives you the core bedroom pieces — a bed and matching side tables — built to your size and finish. Add more later, or keep it clean.",
    priceFrom: 85000,
    priceTo: 120000,
    pieces: ["Bed (custom size)", "Side Tables (×2)", "Finish of your choice"],
    categorySlugs: ["beds", "side-tables"],
  },
  "complete": {
    label: "Complete",
    tagline: "The room looks finished the day it arrives.",
    desc: "The Complete set adds a dressing table and stool to your essentials. A matched set that makes the room look intentional from the first day.",
    priceFrom: 165000,
    priceTo: 220000,
    pieces: ["Bed (custom size)", "Side Tables (×2)", "Dressing Table with Mirror", "Stool", "Finish of your choice"],
    categorySlugs: ["beds", "side-tables", "dressing-tables"],
  },
  "full-house": {
    label: "Full House",
    tagline: "One order. One delivery. Everything matched.",
    desc: "The Full House set is the complete bedroom — every piece ordered together, built in the same finish, and delivered in one go. No hunting for matching furniture later.",
    priceFrom: 330000,
    priceTo: 420000,
    pieces: ["Bed (custom size)", "Side Tables (×2)", "Dressing Table with Mirror", "Stool", "3-door Wardrobe", "Finish of your choice"],
    categorySlugs: ["beds", "side-tables", "dressing-tables", "wardrobes", "bedroom-sets"],
  },
}

type SetSlug = keyof typeof SET_MAP

export default async function SetPage({ params }: { params: Promise<{ set: string }> }) {
  const { set: setSlug } = await params
  const set = SET_MAP[setSlug as SetSlug]
  if (!set) notFound()

  const allProducts = await withReviewRatings(await getProducts())
  const products = allProducts.filter((p) =>
    set.categorySlugs.includes(p.category.slug)
  )

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero — forest gradient */}
      <div
        className="px-5 pb-12 pt-10 sm:px-8 lg:px-14"
        style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)" }}
      >
        <Link
          href="/sets"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] text-bone/50 transition-colors hover:text-bone/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all sets
        </Link>

        <p className="font-mono uppercase text-gold" style={{ fontSize: "10px", letterSpacing: "3px" }}>
          {set.label.toUpperCase()} — BEDROOM SET
        </p>

        <h1
          className="mt-3 font-display text-bone leading-[1.05]"
          style={{ fontSize: "clamp(28px,6vw,48px)" }}
        >
          The {set.label} Set.
          <br />
          <span className="italic text-gold">{set.tagline}</span>
        </h1>

        <p className="mt-4 max-w-lg text-[13.5px] leading-[1.7] text-bone/60">
          {set.desc}
        </p>

        {/* Price range + pieces */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:gap-10">
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">Price range</p>
            <p className="mt-1 font-mono font-bold text-gold" style={{ fontSize: "22px" }}>
              {formatPrice(set.priceFrom)} – {formatPrice(set.priceTo)}
            </p>
            <p className="mt-1 font-mono text-[10.5px] text-bone/35">
              Varies by size · includes delivery
            </p>
          </div>
          <div>
            <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">Includes</p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {set.pieces.map((piece) => (
                <div key={piece} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A24B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="font-mono text-[12px] text-bone/70">{piece}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-14">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[2px] text-gold-700">
              Individual pieces
            </p>
            <h2
              className="mt-1 font-heading font-black text-ink"
              style={{ fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.5px" }}
            >
              What&apos;s in this set
            </h2>
          </div>
          <p className="font-mono text-[11px] text-sage">
            {products.length} piece{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-heading font-bold text-[18px] text-ink">No pieces listed yet</p>
            <p className="mt-2 text-[13px] text-slate">Check back soon, or browse all products.</p>
          </div>
        )}

        {/* CTA strip */}
        <div
          className="mt-14 overflow-hidden rounded-[16px] p-7 text-bone sm:p-10"
          style={{ background: "linear-gradient(135deg,#1c4233,#0a1c15)" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[2px] text-gold/70">Ready to order?</p>
              <p className="mt-1 font-heading font-black text-[20px] text-bone leading-tight">
                Get the full {set.label} set<br />
                <span className="font-display italic text-gold">built to your size.</span>
              </p>
              <p className="mt-2 text-[12.5px] text-bone/50">
                30–50% advance confirms your slot · balance on delivery
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <a
                href={waLink(`Hi, I'm interested in the ${set.label} bedroom set (${setSlug}). Price range: ${formatPrice(set.priceFrom)} – ${formatPrice(set.priceTo)}. Please share more details.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-[10px] bg-gold px-7 py-3.5 font-heading font-bold text-[14px] text-forest transition-colors hover:bg-gold/85"
              >
                Book on WhatsApp
              </a>
              <Link
                href="/showroom"
                className="flex items-center justify-center gap-2 rounded-[10px] border border-bone/20 px-7 py-3.5 font-heading font-bold text-[13.5px] text-bone/70 transition-colors hover:border-bone/40 hover:text-bone"
              >
                Visit showroom
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
