import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getLatestOrderPhoneByEmail } from "@/lib/neon/queries"
import { storeOtp, checkOtpRateLimit } from "@/lib/redis"
import { sendOtpEmail } from "@/lib/email"

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 })

  const email = parsed.data.email.toLowerCase()
  const phone = await getLatestOrderPhoneByEmail(email)

  if (!phone) {
    return NextResponse.json({
      error: "No orders found for this email — place an order first.",
    }, { status: 404 })
  }

  const rateLimit = await checkOtpRateLimit(email)
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many attempts — try again in 15 minutes" }, { status: 429 })
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000))
  await storeOtp(email, otp)
  await sendOtpEmail({ to: email, otp, purpose: "account" }).catch(() => {})

  return NextResponse.json({ ok: true })
}
