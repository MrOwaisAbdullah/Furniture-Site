import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createReview, getApprovedReviewsByProduct } from "@/lib/neon/queries"

const reviewSchema = z.object({
  productSlug: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(10, "Review must be at least 10 characters").max(1000),
})

export async function GET(req: NextRequest) {
  const productSlug = req.nextUrl.searchParams.get("productSlug")
  if (!productSlug) {
    return NextResponse.json({ error: "productSlug is required" }, { status: 400 })
  }

  try {
    const reviews = await getApprovedReviewsByProduct(productSlug)
    return NextResponse.json({ reviews })
  } catch {
    return NextResponse.json({ reviews: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = reviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    await createReview({
      productSlug: parsed.data.productSlug,
      name: parsed.data.name,
      rating: parsed.data.rating,
      body: parsed.data.body,
    })

    return NextResponse.json({ ok: true, message: "Review submitted for moderation." })
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
