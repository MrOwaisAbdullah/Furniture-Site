import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createAffiliateApplication, getAffiliateByEmail } from "@/lib/neon/queries"

const applySchema = z.object({
  name:  z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email(),
  platform: z.string().optional(),
  handle:   z.string().optional(),
  followerCount: z.number().int().min(0).optional(),
  contentType:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const parsed = applySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const existing = await getAffiliateByEmail(parsed.data.email)
  if (existing) {
    return NextResponse.json({ error: "An application with this email already exists" }, { status: 409 })
  }

  try {
    const created = await createAffiliateApplication(parsed.data)
    if (!created) {
      return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
    }
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "An application with this phone number already exists" }, { status: 409 })
  }
}
