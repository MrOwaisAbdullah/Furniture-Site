import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAffiliateByEmail } from "@/lib/neon/queries"
import { storeOtp, checkOtpRateLimit } from "@/lib/redis"
import { sendOtpEmail } from "@/lib/email"

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 })

  const email = parsed.data.email.toLowerCase()
  const affiliate = await getAffiliateByEmail(email)

  // Don't reveal whether the email exists — respond the same either way.
  if (!affiliate) {
    return NextResponse.json({ ok: true })
  }

  if (!affiliate.approvedAt) {
    return NextResponse.json({ error: "Your application is still pending approval" }, { status: 403 })
  }

  const rateLimit = await checkOtpRateLimit(email)
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many attempts — try again in 15 minutes" }, { status: 429 })
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000))
  await storeOtp(email, otp)
  await sendOtpEmail({ to: email, otp, purpose: "affiliate" }).catch(() => {})

  return NextResponse.json({ ok: true })
}
