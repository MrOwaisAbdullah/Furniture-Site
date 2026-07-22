import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProducts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { getSetGroups, maxDiscountForGroupSize } from "@/lib/set-bundle"
import { formatPrice, slugify } from "@/lib/utils"
import { SetPageClient } from "./set-page-client"

async function resolveSet(setSlug: string) {
  const pool = await withReviewRatings(await getProducts())
  const group = getSetGroups(pool).find((g) => slugify(g.setName) === setSlug)
  return { pool, group }
}

export async function generateMetadata({ params }: { params: Promise<{ set: string }> }): Promise<Metadata> {
  const { set: setSlug } = await params
  const { group } = await resolveSet(setSlug)
  if (!group) return {}
  return {
    title: group.setName,
    description: `Browse the ${group.setName} collection — ${group.products.length} matching pieces, save more the more you take.`,
  }
}

export default async function SetPage({ params }: { params: Promise<{ set: string }> }) {
  const { set: setSlug } = await params
  const { pool, group } = await resolveSet(setSlug)
  if (!group) notFound()

  const pieces = group.products
  const cheapest = Math.min(...pieces.map((p) => p.salePrice ?? p.basePrice))
  const savePct = maxDiscountForGroupSize(pieces.length)

  return (
    <div className="min-h-screen bg-surface pb-20 lg:pb-0">
      {/* Hero */}
      <div
        className="px-5 pb-12 pt-10 sm:px-8 lg:px-14"
        style={{ background: "linear-gradient(160deg,#1c4233,#0a1c15)" }}
      >
        <div className="mx-auto max-w-6xl">
          <Link
            href="/sets"
            className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] text-bone/50 transition-colors hover:text-bone/80"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all sets
          </Link>

          <p className="font-mono uppercase text-gold" style={{ fontSize: "10px", letterSpacing: "3px" }}>
            Matching set
          </p>

          <h1 className="mt-3 font-display text-bone leading-[1.05]" style={{ fontSize: "clamp(28px,6vw,48px)" }}>
            {group.setName}
          </h1>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:gap-10">
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">Starting from</p>
              <p className="mt-1 font-mono text-[20px] font-bold text-gold">
                {formatPrice(cheapest)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">Pieces in this set</p>
              <p className="mt-1 font-mono text-[20px] font-bold text-bone">{pieces.length}</p>
            </div>
            {savePct > 0 && (
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">Save up to</p>
                <p className="mt-1 font-mono text-[20px] font-bold text-gold">{savePct}%</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Picker */}
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <SetPageClient setName={group.setName} pieces={pieces} pool={pool} />
      </div>
    </div>
  )
}
