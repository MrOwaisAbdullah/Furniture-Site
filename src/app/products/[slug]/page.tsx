import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductBySlug, getProducts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { getApprovedReviewsByProduct } from "@/lib/neon/queries"
import { getRelatedProducts } from "@/lib/recommendations"
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ProductDetailClient } from "./product-detail-client"
import { BUSINESS_NAME } from "@/lib/site-config"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const price = product.salePrice ?? product.basePrice
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${BUSINESS_NAME}`,
      description: product.description,
      images: [{ url: product.images[0] ?? "", width: 900, height: 600 }],
      url: `https://yousufliving.pk/products/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${BUSINESS_NAME}`,
      description: product.description,
      images: [product.images[0] ?? ""],
    },
    alternates: {
      canonical: `https://yousufliving.pk/products/${slug}`,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const pool = await withReviewRatings(await getProducts())
  const related = getRelatedProducts(product, pool, 4)
  const rating = pool.find((p) => p.slug === product.slug)
  const approvedReviews = await getApprovedReviewsByProduct(slug)
  const saleActive =
    typeof product.salePrice === "number" &&
    typeof product.saleEndsAt === "string" &&
    Date.parse(product.saleEndsAt) > Date.now()

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.images[0] ?? ""}
        price={product.salePrice ?? product.basePrice}
        sku={product._id}
        url={`https://yousufliving.pk/products/${product.slug}`}
        availability={
          product.inStock ? "https://schema.org/InStock" : "https://schema.org/BackOrder"
        }
        priceValidUntil={saleActive ? product.saleEndsAt : undefined}
        rating={rating?.rating}
        reviewCount={rating?.reviewCount}
        reviews={approvedReviews.slice(0, 3).map((r) => ({
          name: r.name,
          rating: r.rating,
          body: r.body,
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: product.category.name, url: `/shop/${product.category.slug}` },
          { name: product.name, url: `/products/${product.slug}` },
        ]}
      />
      <ProductDetailClient product={product} related={related} pool={pool} />
    </>
  )
}
