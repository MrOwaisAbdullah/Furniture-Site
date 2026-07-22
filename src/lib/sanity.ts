import { createClient } from "@sanity/client"
import { createImageUrlBuilder } from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
const apiVersion = "2024-01-01"

// useCdn is deliberately false, not the Sanity-recommended "true in prod":
// this app already caches every read behind Next's own fetch cache
// (revalidate + tags), purged on-demand by the Sanity webhook. Sanity's CDN
// is a second, uncoordinated cache layer the webhook has no way to
// invalidate — a successful revalidateTag() call can still repopulate
// Next's cache with data that's stale at the CDN layer, locking in
// staleness for a full revalidate window. Real API call volume stays low
// regardless, since Next's cache absorbs almost all read traffic.
export const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
})

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const builder = createImageUrlBuilder(readClient)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
