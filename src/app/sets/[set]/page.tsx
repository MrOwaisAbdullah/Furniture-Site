import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBundleBySlug, getProductsByCategory } from "@/lib/sanity/queries"
import { formatPrice } from "@/lib/utils"
import { BundlePageClient } from "./bundle-page-client"

export async function generateMetadata({ params }: { params: Promise<{ set: string }> }): Promise<Metadata> {
  const { set: slug } = await params
  const bundle = await getBundleBySlug(slug)
  if (!bundle) return {}
  return {
    title: bundle.name,
    description: bundle.description || `${bundle.name} — ${bundle.products.length} pieces, one price.`,
  }
}

export default async function BundlePage({ params }: { params: Promise<{ set: string }> }) {
  const { set: slug } = await params
  const bundle = await getBundleBySlug(slug)
  if (!bundle) notFound()

  const decorProducts = await getProductsByCategory("decor")

  const firstFinish = bundle.finishNames[0]
  const sumIfSeparate = bundle.products.reduce((sum, p) => sum + (p.salePrice ?? p.basePrice), 0)
  const savings = Math.max(0, sumIfSeparate - bundle.bundlePrice)

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
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all bundles
          </Link>

          <p className="font-mono uppercase text-gold" style={{ fontSize: "10px", letterSpacing: "3px" }}>
            Bundle deal
          </p>

          <h1 className="mt-3 font-display text-bone leading-[1.05]" style={{ fontSize: "clamp(28px,6vw,48px)" }}>
            {bundle.name}
          </h1>

          {bundle.description && (
            <p className="mt-3 max-w-xl text-[13.5px] leading-[1.65] text-bone/65">{bundle.description}</p>
          )}

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:gap-10">
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">Bundle price</p>
              <p className="mt-1 font-mono text-[20px] font-bold text-gold">
                {formatPrice(bundle.bundlePrice)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">Pieces in this bundle</p>
              <p className="mt-1 font-mono text-[20px] font-bold text-bone">{bundle.products.length}</p>
            </div>
            {savings > 0 && (
              <div>
                <p className="font-mono text-[9.5px] uppercase tracking-[2px] text-bone/40">You save</p>
                <p className="mt-1 font-mono text-[20px] font-bold text-gold">{formatPrice(savings)}</p>
              </div>
            )}
          </div>
          {firstFinish && sumIfSeparate > bundle.bundlePrice && (
            <p className="mt-3 font-mono text-[11px] text-bone/45 line-through">
              {formatPrice(sumIfSeparate)} if bought separately
            </p>
          )}
        </div>
      </div>

      {/* Picker */}
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <BundlePageClient bundle={bundle} decorProducts={decorProducts} />
      </div>
    </div>
  )
}
