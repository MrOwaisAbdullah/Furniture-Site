import type { Metadata } from "next"
import { sampleProducts } from "@/data/sample-products"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = sampleProducts.find((p) => p.slug === slug)
  if (!product) return {}

  const price = product.salePrice ?? product.basePrice

  return {
    title: product.name,
    description: `${product.description.slice(0, 155)}... Shop at Yousuf Living, Karachi. Price: Rs. ${price.toLocaleString()}.`,
    openGraph: {
      title: `${product.name} — Yousuf Living`,
      description: product.description.slice(0, 200),
      url: `https://yousufliving.pk/products/${product.slug}`,
      type: "website",
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
    alternates: {
      canonical: `https://yousufliving.pk/products/${product.slug}`,
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
