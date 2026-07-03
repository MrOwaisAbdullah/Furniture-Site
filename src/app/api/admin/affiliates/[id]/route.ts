import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { approveAffiliate, updateAffiliate } from "@/lib/neon/queries"

const updateSchema = z.object({
  commissionPct:     z.number().min(0).max(100).optional(),
  discountForBuyer:  z.number().min(0).optional(),
  platform:          z.string().optional(),
  handle:            z.string().optional(),
  followerCount:     z.number().int().min(0).optional(),
  contentType:       z.string().optional(),
  contentDeadline:   z.string().optional(),
  contentLiveUrl:    z.string().optional(),
  collabNotes:       z.string().optional(),
  active:            z.boolean().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  if (body.action === "approve") {
    await approveAffiliate(Number(id))
    return NextResponse.json({ ok: true })
  }

  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data
  await updateAffiliate(Number(id), {
    ...data,
    commissionPct: data.commissionPct !== undefined ? String(data.commissionPct) : undefined,
    discountForBuyer: data.discountForBuyer !== undefined ? String(data.discountForBuyer) : undefined,
    contentDeadline: data.contentDeadline ? new Date(data.contentDeadline) : undefined,
  })

  return NextResponse.json({ ok: true })
}
