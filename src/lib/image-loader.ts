"use client"

import type { ImageLoaderProps } from "next/image";

// Custom Next.js image loader that bypasses Vercel's image optimizer
// (/_next/image) entirely. Every transform is delegated to the origin CDN
// via URL params, so Image Optimization quota usage on Vercel's free tier
// stays at ~0. Both hosts below support on-the-fly resizing/formatting:
//   - cdn.sanity.io        (Sanity image CDN)
//   - images.unsplash.com  (Unsplash/imgix)
// Unknown/relative srcs (e.g. R2 custom domain, public/) pass through
// untouched since those hosts cannot transform.
const TRANSFORM_HOSTS: Record<string, string> = {
  "cdn.sanity.io": "max",
  "images.unsplash.com": "crop",
}

const DEFAULT_QUALITY = 90

export default function cdnImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("http")) return src

  try {
    const url = new URL(src)
    const fit = TRANSFORM_HOSTS[url.hostname]
    if (!fit) return src

    url.searchParams.set("w", String(width))
    url.searchParams.set("q", String(quality ?? DEFAULT_QUALITY))
    url.searchParams.set("auto", "format")
    url.searchParams.set("fit", fit)
    return url.toString()
  } catch {
    return src
  }
}