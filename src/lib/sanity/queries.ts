import { readClient, writeClient } from "@/lib/sanity"
import {
  mapSanityProduct, mapSanityCategory, mapSanityBlogPost,
  type RawSanityProduct, type RawSanityCategory, type RawSanitySale, type RawSanityBlogPost,
} from "@/lib/sanity/map-product"

// Every raw product/finish/variant field the mapper needs — shared across
// all 4 product queries so they stay in sync.
const PRODUCT_PROJECTION = `
  _id, name, "slug": slug.current,
  category->{_id, name, "slug": slug.current, description, "image": image.asset->url},
  basePrice, sku, stockCount, inStock, featured, bundleCoversCategories,
  "images": images[].asset->url,
  finishes[]{ _key, name, hexColor, priceModifier, "swatch": swatch.asset->url },
  variants[]{ _key, size, priceModifier },
  dimensions, material, description, careInstructions, tags,
  "_createdAt": _createdAt, "_updatedAt": _updatedAt
`

// ── Sales ─────────────────────────────────────────────────────────────────────

async function getActiveSales(): Promise<RawSanitySale[]> {
  return readClient.fetch(
    `*[_type == "sale" && active == true && startsAt <= now() && endsAt >= now()] {
      _id, discountType, discountValue, endsAt,
      "appliesToProductIds": appliesToProducts[]->_id,
      "appliesToCategoryIds": appliesToCategories[]->_id
    }`,
    {},
    { next: { revalidate: 300, tags: ["sanity", "sale"] } } // short TTL — sales can start/end on a schedule
  )
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts() {
  const [rows, sales] = await Promise.all([
    readClient.fetch<RawSanityProduct[]>(
      `*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) { ${PRODUCT_PROJECTION} }`,
      {},
      { next: { revalidate: 3600, tags: ["sanity", "product"] } }
    ),
    getActiveSales(),
  ])
  return rows.map((r) => mapSanityProduct(r, sales))
}

export async function getFeaturedProducts() {
  const [rows, sales] = await Promise.all([
    readClient.fetch<RawSanityProduct[]>(
      `*[_type == "product" && featured == true && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...6] { ${PRODUCT_PROJECTION} }`,
      {},
      { next: { revalidate: 1800, tags: ["sanity", "product"] } }
    ),
    getActiveSales(),
  ])
  return rows.map((r) => mapSanityProduct(r, sales))
}

export async function getProductBySlug(slug: string) {
  const [row, sales] = await Promise.all([
    readClient.fetch<RawSanityProduct | null>(
      `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] { ${PRODUCT_PROJECTION} }`,
      { slug },
      { next: { revalidate: 3600, tags: ["sanity", "product", `product:${slug}`] } }
    ),
    getActiveSales(),
  ])
  return row ? mapSanityProduct(row, sales) : null
}

export async function getProductsByCategory(categorySlug: string) {
  const [rows, sales] = await Promise.all([
    readClient.fetch<RawSanityProduct[]>(
      `*[_type == "product" && category->slug.current == $categorySlug && !(_id in path("drafts.**"))] | order(_createdAt desc) { ${PRODUCT_PROJECTION} }`,
      { categorySlug },
      { next: { revalidate: 3600, tags: ["sanity", "product", "category", `category:${categorySlug}`] } }
    ),
    getActiveSales(),
  ])
  return rows.map((r) => mapSanityProduct(r, sales))
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
  const rows = await readClient.fetch<RawSanityCategory[]>(
    `*[_type == "category" && !(_id in path("drafts.**"))] | order(order asc) {
      _id, name, "slug": slug.current, description,
      "image": image.asset->url,
      "productCount": count(*[_type == "product" && references(^._id)])
    }`,
    {},
    { next: { revalidate: 3600, tags: ["sanity", "category"] } }
  )
  return rows.map(mapSanityCategory)
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export async function getBlogPosts() {
  const rows = await readClient.fetch<RawSanityBlogPost[]>(
    `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id, title, "slug": slug.current, excerpt, publishedAt,
      "featuredImage": featuredImage.asset->url,
      author
    }`,
    {},
    { next: { revalidate: 86400, tags: ["sanity", "blogPost"] } }
  )
  return rows.map(mapSanityBlogPost)
}

export async function getBlogPostBySlug(slug: string) {
  const row = await readClient.fetch<RawSanityBlogPost | null>(
    `*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, "slug": slug.current, excerpt, publishedAt,
      "featuredImage": featuredImage.asset->url,
      author, body
    }`,
    { slug },
    { next: { revalidate: 86400, tags: ["sanity", "blogPost", `blogPost:${slug}`] } }
  )
  return row ? mapSanityBlogPost(row) : null
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return readClient.fetch(
    `*[_type == "siteSettings"][0] {
      siteName, tagline, whatsappNumber, address, hours,
      socialLinks, seoDefaults
    }`,
    {},
    { next: { revalidate: 3600, tags: ["sanity", "siteSettings"] } }
  )
}

// ── Promo Popup ─────────────────────────────────────────────────────────────

export interface ActivePopup {
  _id: string
  imageUrl: string
  imageWidth: number
  imageHeight: number
  alt: string
  linkUrl: string | null
  delaySeconds: number
  maxPerSession: number
  cooldownDays: number
}

/**
 * The single active promo popup to show, if any. Returns the most recently
 * updated active document whose optional date window currently applies.
 * The frontend handles all timing/frequency (delay, per-session cap, cooldown).
 */
export async function getActivePopup(): Promise<ActivePopup | null> {
  const row = await readClient.fetch<{
    _id: string
    imageUrl: string | null
    imageWidth: number | null
    imageHeight: number | null
    alt: string | null
    linkUrl: string | null
    delaySeconds: number | null
    maxPerSession: number | null
    cooldownDays: number | null
  } | null>(
    `*[_type == "promoPopup" && active == true
        && (!defined(startsAt) || startsAt <= now())
        && (!defined(endsAt) || endsAt >= now())
        && defined(image.asset)
      ] | order(_updatedAt desc) [0] {
        _id,
        "imageUrl": image.asset->url,
        "imageWidth": image.asset->metadata.dimensions.width,
        "imageHeight": image.asset->metadata.dimensions.height,
        "alt": image.alt,
        linkUrl, delaySeconds, maxPerSession, cooldownDays
      }`,
    {},
    { next: { revalidate: 300, tags: ["sanity", "promoPopup"] } }
  )

  if (!row?.imageUrl) return null

  return {
    _id: row._id,
    imageUrl: row.imageUrl,
    imageWidth: row.imageWidth ?? 800,
    imageHeight: row.imageHeight ?? 800,
    alt: row.alt ?? "Promotion",
    linkUrl: row.linkUrl || null,
    delaySeconds: row.delaySeconds ?? 3,
    maxPerSession: row.maxPerSession ?? 1,
    cooldownDays: row.cooldownDays ?? 7,
  }
}

// ── Stock management ──────────────────────────────────────────────────────────

/**
 * Decrement product-level stock after an order. Stock is tracked per
 * product only (variants here are just size options with a price
 * modifier, not independently-stocked SKUs — see Variant in src/types).
 * Returns true on success, false if stock is insufficient or the document
 * doesn't exist.
 */
export async function decrementStock(productId: string, qty: number): Promise<boolean> {
  try {
    const product = await readClient.fetch<{ _id: string; stockCount: number } | null>(
      `*[_type == "product" && _id == $id][0] { _id, stockCount }`,
      { id: productId }
    )
    if (!product) return false
    if ((product.stockCount ?? 0) < qty) return false

    const newCount = (product.stockCount ?? 0) - qty
    await writeClient
      .patch(productId)
      .set({ stockCount: newCount, inStock: newCount > 0 })
      .commit()

    return true
  } catch (err) {
    console.error("[sanity] decrementStock error", err)
    return false
  }
}
