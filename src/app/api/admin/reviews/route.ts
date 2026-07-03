import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { setReviewApproved } from "@/lib/neon/queries"

const schema = z.object({ id: z.number(), approved: z.boolean() })

export async function PATCH(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  await setReviewApproved(parsed.data.id, parsed.data.approved)
  return NextResponse.json({ ok: true })
}
