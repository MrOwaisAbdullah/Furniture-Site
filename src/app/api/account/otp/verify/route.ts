import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { nanoid } from "nanoid"
import { getLatestOrderPhoneByEmail } from "@/lib/neon/queries"
import { verifyAndConsumeOtp, createPortalSession } from "@/lib/redis"

const schema = z.object({ email: z.string().email(), otp: z.string().length(6) })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const email = parsed.data.email.toLowerCase()
  const valid = await verifyAndConsumeOtp(email, parsed.data.otp)
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 })
  }

  // Account data (orders, coupons, redemptions) is keyed by phone, so
  // resolve it once more here rather than trusting a client-supplied value.
  const phone = await getLatestOrderPhoneByEmail(email)
  if (!phone) {
    return NextResponse.json({ error: "No orders found for this email" }, { status: 404 })
  }

  const token = nanoid(32)
  await createPortalSession("account", phone, token)

  const res = NextResponse.json({ ok: true })
  res.cookies.set("account_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
