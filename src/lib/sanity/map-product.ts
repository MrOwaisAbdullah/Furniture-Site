import type { Product, Category, Finish, Variant, BlogPost } from "@/types"
import { hexForFinishName } from "@/lib/finish-colors"

// ── Raw GROQ result shapes (loose — this is the boundary where untyped CMS
// JSON meets the app's real types; everything past this file is typed). ──

export interface RawSanityCategory {
  _id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  productCount?: number
}

export interface RawSanityFinish {
  _key: string
  name: string
  priceModifier?: number | null
  images?: string[] | null
}

export interface RawSanityVariant {
  _key: string
  size: string
  priceModifier?: number | null
}

export interface RawSanityProduct {
  _id: string
  name: string
  slug: string
  category: RawSanityCategory
  basePrice: number
  sku?: string | null
  stockCount?: number | null
  inStock?: boolean | null
  featured?: boolean | null
  bundleCoversCategories?: string[] | null
  setName?: string | null
  images?: string[] | null
  finishes?: RawSanityFinish[] | null
  variants?: RawSanityVariant[] | null
  dimensions?: { width?: string | null; height?: string | null; depth?: string | null; unit?: string | null } | null
  material?: string | null
  description?: string | null
  careInstructions?: string | null
  tags?: string[] | null
  _createdAt: string
  _updatedAt: string
}

export interface RawSanitySale {
  _id: string
  discountType: "percentage" | "fixed"
  discountValue: number
  appliesToProductIds: string[]
  appliesToCategoryIds: string[]
  endsAt: string
}

export interface RawSanityBlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string | null
  body: unknown // Portable Text block array — rendered with @portabletext/react, never stringified
  featuredImage?: string | null
  author?: string | null
  publishedAt: string
  tags?: string[] | null
  faq?: { question: string; answer: string }[] | null
  seo?: { metaTitle?: string | null; metaDescription?: string | null } | null
}

// ── Sale resolution ─────────────────────────────────────────────────────────

/**
 * A product's effective sale price, resolved against every currently-active
 * sale (the caller is responsible for only passing sales where
 * active == true and now() falls within [startsAt, endsAt] — see
 * getActiveSales() in queries.ts). If more than one sale covers this
 * product (direct reference or via its category), the one giving the
 * larger discount wins — simple, predictable tie-break.
 */
export function resolveSalePrice(
  basePrice: number,
  productId: string,
  categoryId: string,
  activeSales: RawSanitySale[]
): { salePrice?: number; saleEndsAt?: string } {
  let best: { discountedPrice: number; endsAt: string } | null = null

  for (const sale of activeSales) {
    const matches = sale.appliesToProductIds.includes(productId) || sale.appliesToCategoryIds.includes(categoryId)
    if (!matches) continue

    const discountedPrice = sale.discountType === "percentage"
      ? basePrice * (1 - sale.discountValue / 100)
      : basePrice - sale.discountValue

    if (discountedPrice >= basePrice || discountedPrice < 0) continue // not a real discount, skip

    if (!best || discountedPrice < best.discountedPrice) {
      best = { discountedPrice, endsAt: sale.endsAt }
    }
  }

  if (!best) return {}
  return { salePrice: Math.round(best.discountedPrice), saleEndsAt: best.endsAt }
}

// ── Mappers ──────────────────────────────────────────────────────────────────

function mapFinish(raw: RawSanityFinish): Finish {
  return {
    _id: raw._key,
    name: raw.name,
    colorCode: hexForFinishName(raw.name),
    priceModifier: raw.priceModifier ?? 0,
    images: raw.images ?? [],
  }
}

function mapVariant(raw: RawSanityVariant): Variant {
  return {
    _id: raw._key,
    size: raw.size,
    priceModifier: raw.priceModifier ?? 0,
  }
}

export function mapSanityCategory(raw: RawSanityCategory): Category {
  return {
    _id: raw._id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    image: raw.image ?? "",
    productCount: raw.productCount ?? 0,
  }
}

/** Truncates on a word boundary near `maxLength` rather than mid-word. */
function truncate(text: string, maxLength = 140): string {
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(" ")
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`
}

export function mapSanityProduct(raw: RawSanityProduct, activeSales: RawSanitySale[]): Product {
  const { salePrice, saleEndsAt } = resolveSalePrice(raw.basePrice, raw._id, raw.category._id, activeSales)
  const description = raw.description ?? ""

  return {
    _id: raw._id,
    name: raw.name,
    slug: raw.slug,
    description,
    shortDescription: truncate(description),
    basePrice: raw.basePrice,
    salePrice,
    saleEndsAt,
    category: mapSanityCategory(raw.category),
    variants: (raw.variants ?? []).map(mapVariant),
    finishes: (raw.finishes ?? []).map(mapFinish),
    dimensions: {
      width: Number(raw.dimensions?.width) || 0,
      height: Number(raw.dimensions?.height) || 0,
      depth: Number(raw.dimensions?.depth) || 0,
      unit: raw.dimensions?.unit === "in" ? "in" : "cm",
    },
    material: raw.material ?? "",
    careInstructions: raw.careInstructions ?? "",
    images: raw.images ?? [],
    featured: raw.featured ?? false,
    inStock: raw.inStock ?? true,
    stockCount: raw.stockCount ?? 0,
    sku: raw.sku ?? "",
    tags: raw.tags ?? [],
    // rating/reviewCount deliberately left unset — computed from the real
    // Neon reviews table where displayed (getApprovedReviewsByProduct),
    // not stored on the catalog record where it could drift from reality.
    createdAt: raw._createdAt,
    updatedAt: raw._updatedAt,
    bundleCoversCategories: raw.bundleCoversCategories ?? undefined,
    setName: raw.setName || undefined,
  }
}

export function mapSanityBlogPost(raw: RawSanityBlogPost): BlogPost {
  return {
    _id: raw._id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? "",
    body: raw.body,
    featuredImage: raw.featuredImage ?? "",
    author: raw.author ?? "",
    tags: raw.tags ?? [],
    publishedAt: raw.publishedAt,
    updatedAt: raw.publishedAt,
    faq: raw.faq ?? [],
    metaTitle: raw.seo?.metaTitle || undefined,
    metaDescription: raw.seo?.metaDescription || undefined,
  }
}
