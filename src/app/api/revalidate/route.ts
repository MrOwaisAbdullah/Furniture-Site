import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook"

// Sanity content-change webhook → on-demand cache purge.
//
// Configure in sanity.io/manage → API → Webhooks:
//   • URL:     https://yousufliving.pk/api/revalidate
//   • Trigger: Create, Update, Delete
//   • Filter:  _type in ["product", "category", "sale", "blogPost", "siteSettings", "promoPopup"]
//   • Projection: { _type, "slug": slug.current }
//   • Secret:  same value as SANITY_REVALIDATE_SECRET below
//
// The signature is computed over the RAW request body, so we must read it as
// text (not req.json()) before parsing — re-encoding the JSON would change the
// bytes and break verification.

const SECRET = process.env.SANITY_REVALIDATE_SECRET

interface WebhookBody {
  _type?: string
  slug?: string
}

export async function POST(req: NextRequest) {
  if (!SECRET) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set")
    return NextResponse.json({ error: "Not configured" }, { status: 500 })
  }

  const signature = req.headers.get(SIGNATURE_HEADER_NAME)
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 })
  }

  const rawBody = await req.text()

  if (!(await isValidSignature(rawBody, signature, SECRET))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let body: WebhookBody
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { _type, slug } = body
  if (!_type) {
    return NextResponse.json({ error: "Missing _type" }, { status: 400 })
  }

  // Always purge the type-level tag; add the specific-document tag when a slug
  // is present so single-item pages (product/category/blog detail) refresh too.
  const tags = new Set<string>([_type])
  if (slug) tags.add(`${_type}:${slug}`)

  // A product/category/sale change can shift computed prices and listings that
  // read the shared product pool, so purge product + category alongside it.
  if (_type === "product" || _type === "category" || _type === "sale") {
    tags.add("product")
    tags.add("category")
  }

  // Next 16: route handlers pass "max" to purge immediately (updateTag is
  // Server-Action-only). The single-arg form is deprecated.
  for (const tag of tags) revalidateTag(tag, "max")

  return NextResponse.json({ revalidated: true, tags: [...tags] })
}
