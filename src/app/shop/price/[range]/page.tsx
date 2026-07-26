import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProducts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { PRICE_RANGES, priceInRange } from "@/lib/price-ranges"
import { ProductCard } from "@/components/product/product-card"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ range: string }>
}): Promise<Metadata> {
  const { range: rangeSlug } = await params
  const range = PRICE_RANGES.find((r) => r.slug === rangeSlug)
  if (!range) return {}

  return {
    title: `${range.label} — Shop by Budget`,
    description: `Browse Yousuf Living furniture priced ${range.label.toLowerCase()}.`,
    alternates: {
      canonical: `https://yousufliving.pk/shop/price/${range.slug}`,
    },
  }
}

export default async function PriceRangePage({
  params,
}: {
  params: Promise<{ range: string }>
}) {
  const { range: rangeSlug } = await params
  const range = PRICE_RANGES.find((r) => r.slug === rangeSlug)
  if (!range) notFound()

  const products = await withReviewRatings(await getProducts())
  const inRange = products.filter((p) => priceInRange(p.salePrice ?? p.basePrice, range))

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: "Shop by budget", url: "/shop/price" },
          { name: range.label, url: `/shop/price/${range.slug}` },
        ]}
      />
      <ItemListJsonLd
        items={inRange.map((p, i) => ({
          name: p.name,
          url: `/products/${p.slug}`,
          position: i + 1,
        }))}
      />

      <div
        className="px-5 pb-8 pt-8 text-bone sm:px-8 lg:px-10"
        style={{ background: "linear-gradient(145deg,#1c4233,#0a1c15)" }}
      >
        <Link
          href="/shop/price"
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[1.5px] text-bone/60 hover:text-bone"
        >
          <ArrowLeft className="h-3 w-3" />
          Shop by budget
        </Link>
        <h1
          className="mt-3 font-heading font-black leading-tight text-bone"
          style={{ fontSize: "clamp(22px,5vw,38px)", letterSpacing: "-0.5px" }}
        >
          {range.label}
        </h1>
        <p className="mt-1 font-mono text-[10px] text-bone/40">
          {inRange.length} item{inRange.length !== 1 ? "s" : ""}
        </p>

        {/* Quick switch between the other ranges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {PRICE_RANGES.map((r) => (
            <Link
              key={r.slug}
              href={`/shop/price/${r.slug}`}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11.5px] transition-colors ${
                r.slug === range.slug
                  ? "bg-gold text-forest font-bold"
                  : "border border-bone/20 text-bone/70 hover:border-bone/40 hover:text-bone"
              }`}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 sm:px-8 lg:px-10">
        {inRange.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="font-heading font-bold text-[17px] text-ink">No products in this range yet</p>
            <p className="text-[13px] text-slate">Check back soon, or browse a different budget.</p>
            <Link href="/shop/price" className="mt-2 rounded-[10px] bg-forest px-5 py-3 font-heading font-bold text-[13.5px] text-bone">
              Shop by budget
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {inRange.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
