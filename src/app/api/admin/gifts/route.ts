import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { markGiftGiven, markThankyouCodeSent } from "@/lib/neon/queries"

const schema = z.union([
  z.object({ id: z.number(), action: z.literal("give"), giftTier: z.string() }),
  z.object({ id: z.number(), action: z.literal("thankyou") }),
])

export async function PATCH(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  if (parsed.data.action === "give") {
    await markGiftGiven(parsed.data.id, parsed.data.giftTier)
  } else {
    await markThankyouCodeSent(parsed.data.id)
  }
  return NextResponse.json({ ok: true })
}
