import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createQuestion, getAnsweredQuestionsByProduct } from "@/lib/neon/queries"

const questionSchema = z.object({
  productSlug: z.string().min(1),
  name: z.string().min(1, "Name is required").max(100),
  question: z.string().min(5, "Question must be at least 5 characters").max(500),
})

export async function GET(req: NextRequest) {
  const productSlug = req.nextUrl.searchParams.get("productSlug")
  if (!productSlug) {
    return NextResponse.json({ error: "productSlug is required" }, { status: 400 })
  }

  try {
    const questions = await getAnsweredQuestionsByProduct(productSlug)
    return NextResponse.json({ questions })
  } catch {
    return NextResponse.json({ questions: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = questionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    await createQuestion(parsed.data)
    return NextResponse.json({ ok: true, message: "Question submitted — we'll answer it soon." })
  } catch {
    return NextResponse.json({ error: "Failed to submit question" }, { status: 500 })
  }
}
