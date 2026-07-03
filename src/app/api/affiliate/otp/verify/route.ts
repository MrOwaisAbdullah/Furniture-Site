import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { nanoid } from "nanoid"
import { getAffiliateByEmail } from "@/lib/neon/queries"
import { verifyAndConsumeOtp, createPortalSession } from "@/lib/redis"

const schema = z.object({ email: z.string().email(), otp: z.string().length(6) })

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const email = parsed.data.email.toLowerCase()
  const affiliate = await getAffiliateByEmail(email)
  if (!affiliate || !affiliate.approvedAt) {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 })
  }

  const valid = await verifyAndConsumeOtp(email, parsed.data.otp)
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 })
  }

  const token = nanoid(32)
  await createPortalSession("affiliate", String(affiliate.id), token)

  const res = NextResponse.json({ ok: true })
  res.cookies.set("affiliate_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
