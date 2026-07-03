import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { markPayoutPaid } from "@/lib/neon/queries"

const schema = z.object({ paymentRef: z.string().optional() })

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  await markPayoutPaid(Number(id), parsed.data.paymentRef)
  return NextResponse.json({ ok: true })
}
