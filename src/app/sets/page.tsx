import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getBundles } from "@/lib/sanity/queries"
import { resolveBundleImages } from "@/lib/bundle"
import { formatPrice } from "@/lib/utils"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "Bundle Deals",
  description:
    "Hand-picked bundles from our workshop — real pieces, one color, one price, always cheaper than buying separately.",
  openGraph: {
    title: "Bundle Deals — Yousuf Living",
    description: "Hand-picked bundles from our workshop, always cheaper than buying separately.",
    url: "https://yousufliving.pk/sets",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/sets",
  },
}

const SETS_HERO = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"

export default async function SetsPage() {
  const bundles = await getBundles()

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Bundles", url: "/sets" },
        ]}
      />
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 240 }}>
        <Image
          src={SETS_HERO}
          alt="Bundle deals"
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
            Bundle deals
          </p>
          <h1 className="mt-3 font-display leading-[1.05]" style={{ fontSize: "clamp(28px,7vw,50px)" }}>
            Hand-picked bundles.
            <br />
            <span className="italic text-gold">One price.</span>
          </h1>
          <p className="mt-4 max-w-md text-[13px] leading-[1.65] text-bone/65">
            Every bundle below is real pieces from our workshop, priced together — always cheaper than buying each piece separately.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        {bundles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-heading font-bold text-[17px] text-ink">No bundles yet</p>
            <p className="mt-2 text-[13px] text-slate">Check back soon, or browse individual pieces in the shop.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((bundle) => {
              const firstFinish = bundle.finishNames[0]
              const thumb =
                bundle.image ||
                (firstFinish ? bundle.products.map((p) => resolveBundleImages(p, firstFinish)[0]).find(Boolean) : undefined)
              const sumIfSeparate = firstFinish
                ? bundle.products.reduce((sum, p) => sum + (p.salePrice ?? p.basePrice), 0)
                : 0
              const savings = Math.max(0, sumIfSeparate - bundle.bundlePrice)

              return (
                <Link
                  key={bundle._id}
                  href={`/sets/${bundle.slug}`}
                  className="group overflow-hidden rounded-[16px] border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(22,53,42,.18)]"
                >
                  <div className="relative h-[160px] w-full bg-surface-sunken">
                    {thumb && (
                      <Image
                        src={thumb}
                        alt={bundle.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    {savings > 0 && (
                      <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[1px] text-forest">
                        Save {formatPrice(savings)}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-bold text-[15px] text-ink">{bundle.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-sage">
                      {bundle.products.length} item{bundle.products.length !== 1 ? "s" : ""}
                    </p>
                    <p className="mt-1.5 font-mono text-[13px] text-forest">{formatPrice(bundle.bundlePrice)}</p>
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
