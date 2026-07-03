import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop — All Furniture",
  description:
    "Browse all furniture at Yousuf Living. Beds, wardrobes, dressing tables, side tables, and complete bedroom sets — made to order in Karachi.",
  openGraph: {
    title: "Shop All Furniture — Yousuf Living",
    description:
      "Browse all furniture at Yousuf Living. Beds, wardrobes, dressing tables, and complete bedroom sets.",
    url: "https://yousufliving.pk/shop",
    type: "website",
  },
  alternates: {
    canonical: "https://yousufliving.pk/shop",
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
