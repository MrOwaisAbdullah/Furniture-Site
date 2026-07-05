import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { setReviewApproved, deleteReview } from "@/lib/neon/queries"

const patchSchema = z.object({ id: z.number(), approved: z.boolean() })
const deleteSchema = z.object({ id: z.number() })

export async function PATCH(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = patchSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  await setReviewApproved(parsed.data.id, parsed.data.approved)
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = deleteSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  await deleteReview(parsed.data.id)
  return NextResponse.json({ ok: true })
}
