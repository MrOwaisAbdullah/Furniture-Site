import { getProducts, getCategories } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"
import { BreadcrumbJsonLd } from "@/components/seo/json-ld"
import { ShopClient } from "./shop-client"

export default async function ShopPage() {
  const [rawProducts, categories] = await Promise.all([getProducts(), getCategories()])
  const products = await withReviewRatings(rawProducts)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
        ]}
      />
      <ShopClient products={products} categories={categories} />
    </>
  )
}
