import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { insertEvent } from "@/lib/neon/queries"

const schema = z.object({
  event:     z.string().min(1).max(80),
  sessionId: z.string().min(1),
  page:      z.string().optional(),
  productId: z.string().optional(),
  meta:      z.record(z.string(), z.unknown()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({}, { status: 400 })

    // Drop any PII fields from meta
    const { meta, ...rest } = parsed.data
    const safeMeta = meta ? Object.fromEntries(
      Object.entries(meta).filter(([k]) => !["name", "phone", "email", "address"].includes(k))
    ) : undefined

    await insertEvent({ ...rest, meta: safeMeta })
    return NextResponse.json({}, { status: 201 })
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}
