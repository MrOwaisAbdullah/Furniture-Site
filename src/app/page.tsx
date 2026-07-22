import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { TrustBar } from "@/components/layout/trust-bar"
import { FeaturedSets } from "@/components/home/featured-sets"
import { ShopByCategory } from "@/components/home/shop-by-category"
import { ShaadiStrip } from "@/components/home/shaadi-strip"
import { HowItWorks } from "@/components/home/how-it-works"
import { WhyYousuf } from "@/components/home/why-yousuf"
import { CustomizationShowcase } from "@/components/home/customization-showcase"
import { SocialProof } from "@/components/home/social-proof"
import { BlogTeasers } from "@/components/home/blog-teasers"
import { ShowroomBlock } from "@/components/home/showroom-block"
import { OrganizationJsonLd, LocalBusinessJsonLd } from "@/components/seo/json-ld"
import { getFeaturedProducts, getCategories, getBlogPosts } from "@/lib/sanity/queries"
import { withReviewRatings } from "@/lib/reviews/apply-summaries"

export const metadata: Metadata = {
  title: "Yousuf Living — Workshop-built Furniture in Karachi",
  description:
    "Workshop-built bedroom sets, fairly priced. Beds, wardrobes, dressing tables and complete sets — made to order in Karachi. Visit our Manzoor Colony showroom.",
  openGraph: {
    title: "Yousuf Living — Workshop-built Furniture in Karachi",
    description:
      "Workshop-built bedroom sets, fairly priced. Beds, wardrobes, dressing tables and complete sets — made to order in Karachi.",
    url: "https://yousufliving.pk",
    siteName: "Yousuf Living",
    type: "website",
    locale: "en_PK",
  },
  alternates: {
    canonical: "https://yousufliving.pk",
  },
}

export default async function HomePage() {
  const [rawFeaturedProducts, categories, blogPosts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getBlogPosts(),
  ])
  const featuredProducts = await withReviewRatings(rawFeaturedProducts)

  return (
    <>
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <Hero />
      <TrustBar />
      <FeaturedSets products={featuredProducts} />
      <ShopByCategory categories={categories} />
      <ShaadiStrip />
      <HowItWorks />
      <WhyYousuf />
      <CustomizationShowcase />
      <SocialProof />
      <BlogTeasers posts={blogPosts.slice(0, 3)} />
      <ShowroomBlock />
    </>
  )
}
