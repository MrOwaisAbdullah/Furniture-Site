import { readClient } from "@/lib/sanity"

// ── Products ──────────────────────────────────────────────────────────────────

export async function getProducts() {
  return readClient.fetch(
    `*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      _id, name, slug, category->{name, slug},
      basePrice, salePrice, inStock,
      "images": images[].asset->url,
      finishes[]{ _key, name, hexColor, priceModifier, "swatch": swatch.asset->url },
      variants[]{ _key, _id, size, priceModifier },
      dimensions, material, description, careInstructions,
      tags, featured
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

export async function getFeaturedProducts() {
  return readClient.fetch(
    `*[_type == "product" && featured == true && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...6] {
      _id, name, slug, category->{name, slug},
      basePrice, salePrice, inStock,
      "images": images[].asset->url,
      finishes[]{ _key, name, hexColor, priceModifier },
      variants[]{ _key, _id, size, priceModifier },
      tags
    }`,
    {},
    { next: { revalidate: 1800 } }
  )
}

export async function getProductBySlug(slug: string) {
  return readClient.fetch(
    `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, name, "slug": slug.current, category->{name, "slug": slug.current},
      basePrice, salePrice, inStock,
      "images": images[].asset->url,
      finishes[]{ _key, _id: _key, name, hexColor, priceModifier, "swatch": swatch.asset->url },
      variants[]{ _key, _id: _key, size, priceModifier },
      dimensions, material, description, careInstructions,
      tags
    }`,
    { slug },
    { next: { revalidate: 3600 } }
  )
}

export async function getProductsByCategory(categorySlug: string) {
  return readClient.fetch(
    `*[_type == "product" && category->slug.current == $categorySlug && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      _id, name, slug, category->{name, slug},
      basePrice, salePrice, inStock,
      "images": images[].asset->url,
      finishes[]{ _key, name, hexColor, priceModifier },
      variants[]{ _key, _id, size, priceModifier },
      tags
    }`,
    { categorySlug },
    { next: { revalidate: 3600 } }
  )
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
  return readClient.fetch(
    `*[_type == "category" && !(_id in path("drafts.**"))] | order(order asc) {
      _id, name, "slug": slug.current, description,
      "image": image.asset->url
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export async function getBlogPosts() {
  return readClient.fetch(
    `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id, title, "slug": slug.current, excerpt, publishedAt,
      "featuredImage": featuredImage.asset->url,
      author
    }`,
    {},
    { next: { revalidate: 86400 } }
  )
}

export async function getBlogPostBySlug(slug: string) {
  return readClient.fetch(
    `*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, "slug": slug.current, excerpt, publishedAt,
      "featuredImage": featuredImage.asset->url,
      author, body
    }`,
    { slug },
    { next: { revalidate: 86400 } }
  )
}

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return readClient.fetch(
    `*[_type == "siteSettings"][0] {
      siteName, tagline, whatsappNumber, address, hours,
      socialLinks, seoDefaults
    }`,
    {},
    { next: { revalidate: 3600 } }
  )
}
