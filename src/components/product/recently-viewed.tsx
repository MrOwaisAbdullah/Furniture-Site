"use client"

import { useEffect, useState } from "react"
import { recentlyViewedClient, type RecentlyViewedItem } from "@/lib/recently-viewed-client"
import { ProductCardCompact } from "@/components/product/product-card"
import type { Product } from "@/types"

/** Builds a minimal Product-shaped object from the lightweight localStorage
 * record so it can be rendered with the existing ProductCardCompact. */
function toCardProduct(item: RecentlyViewedItem): Product {
  return {
    _id: item.productId,
    name: item.name,
    slug: item.slug,
    basePrice: item.price,
    images: item.image ? [item.image] : [],
    category: { _id: "", name: "", slug: "", description: "", image: "", productCount: 0 },
    variants: [],
    finishes: [],
    dimensions: { width: 0, height: 0, depth: 0, unit: "cm" },
    material: "",
    careInstructions: "",
    featured: false,
    inStock: true,
    stockCount: 0,
    sku: "",
    tags: [],
    description: "",
    shortDescription: "",
    createdAt: "",
    updatedAt: "",
  }
}

export function RecentlyViewed({ excludeProductId, title = "Recently viewed" }: { excludeProductId?: string; title?: string }) {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    setMounted(true)
    setItems(recentlyViewedClient.getAll(excludeProductId))
  }, [excludeProductId])

  if (!mounted || items.length === 0) return null

  return (
    <div className="mt-14">
      <h2
        className="mb-6 font-heading font-black text-ink"
        style={{ fontSize: "clamp(18px,2.5vw,24px)", letterSpacing: "-0.5px" }}
      >
        {title}
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {items.map((item) => (
          <ProductCardCompact key={item.productId} product={toCardProduct(item)} />
        ))}
      </div>
    </div>
  )
}
