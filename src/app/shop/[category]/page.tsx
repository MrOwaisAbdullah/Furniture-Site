import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getProductsByCategory, getCategories } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/json-ld"
import { ShopClient } from "@/app/shop/shop-client"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === category)
  // Missing category → real 404. noindex so Google drops it cleanly rather
  // than holding it as a Soft 404 with the homepage title.
  if (!cat) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${cat.name} — Shop`,
    description: `Browse our collection of ${cat.name.toLowerCase()} at Yousuf Living. Made to order in Karachi with honest materials and fair pricing.`,
    openGraph: {
      title: `${cat.name} — Yousuf Living`,
      description: `Browse our collection of ${cat.name.toLowerCase()} at Yousuf Living. Made to order in Karachi.`,
      url: `https://yousufliving.pk/shop/${cat.slug}`,
      type: "website",
    },
    alternates: {
      canonical: `https://yousufliving.pk/shop/${cat.slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === category)
  if (!cat) notFound()

  const products = await withReviewRatings(await getProductsByCategory(category))

  return (
    <div className="min-h-screen bg-surface">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: cat.name, url: `/shop/${cat.slug}` },
        ]}
      />
      <ItemListJsonLd
        items={products.map((p, i) => ({
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
          href="/shop"
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[1.5px] text-bone/60 hover:text-bone"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Shop
        </Link>
        <h1
          className="mt-3 font-heading font-black leading-tight text-bone"
          style={{ fontSize: "clamp(22px,5vw,38px)", letterSpacing: "-0.5px" }}
        >
          {cat.name}
        </h1>
        <p className="mt-1.5 text-[12.5px] text-bone/60">{cat.description}</p>
        <p className="mt-1 font-mono text-[10px] text-bone/40">
          {products.length} item{products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="font-heading font-bold text-[17px] text-ink">No products yet</p>
            <p className="text-[13px] text-slate">Check back soon — new pieces are added regularly.</p>
            <Link href="/shop" className="mt-2 rounded-[10px] bg-forest px-5 py-3 font-heading font-bold text-[13.5px] text-bone">
              Browse all
            </Link>
          </div>
        </div>
      ) : (
        <ShopClient products={products} categories={categories} lockedCategory={{ slug: cat.slug, name: cat.name }} />
      )}
    </div>
  )
}
