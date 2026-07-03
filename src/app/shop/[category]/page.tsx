import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { sampleProducts } from "@/data/sample-products"
import { sampleCategories } from "@/data/sample-categories"
import { formatPrice } from "@/lib/utils"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = sampleCategories.find((c) => c.slug === category)
  if (!cat) return {}

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
  const cat = sampleCategories.find((c) => c.slug === category)
  if (!cat) notFound()

  const products = sampleProducts.filter((p) => p.category.slug === category)

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

      <div className="px-5 py-6 sm:px-8 lg:px-10">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="font-heading font-bold text-[17px] text-ink">No products yet</p>
            <p className="text-[13px] text-slate">Check back soon — new pieces are added regularly.</p>
            <Link href="/shop" className="mt-2 rounded-[10px] bg-forest px-5 py-3 font-heading font-bold text-[13.5px] text-bone">
              Browse all
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-[16px] border border-border bg-white transition-shadow hover:shadow-md"
              >
                <div
                  className="aspect-[4/3] w-full"
                  style={{ background: "linear-gradient(150deg,#e8e0d0,#d4caba)" }}
                />
                <div className="p-3.5">
                  <p className="font-mono text-[9px] uppercase tracking-[1.5px] text-sage">{product.category.name}</p>
                  <p className="mt-1.5 font-heading font-black text-[14px] leading-snug text-ink line-clamp-2 group-hover:text-forest transition-colors">
                    {product.name}
                  </p>
                  <p className="mt-2 font-mono text-[13px] text-gold-700">{formatPrice(product.basePrice)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
