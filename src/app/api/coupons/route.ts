import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateCoupon } from "@/lib/neon/queries"
import { checkCouponRateLimit } from "@/lib/redis"

const schema = z.object({
  code:       z.string().min(1).max(30),
  orderTotal: z.number().min(0),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  const { allowed, remaining } = await checkCouponRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again in an hour." }, { status: 429 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const result = await validateCoupon(parsed.data.code, parsed.data.orderTotal)
  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.reason, remaining }, { status: 200 })
  }

  return NextResponse.json({
    valid: true,
    code:        result.coupon?.code,
    type:        result.coupon?.type,
    value:       result.coupon?.value,
    discountAmt: result.discountAmt,
    remaining,
  })
}
