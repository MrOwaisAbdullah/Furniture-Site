import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { updateOrderStatus, ensureGiftEntry } from "@/lib/neon/queries"

const bodySchema = z.object({
  status: z.enum([
    "payment_pending", "payment_confirmed", "building", "polishing",
    "finishing", "ready", "delivered", "cancelled",
  ]),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ ref: string }> }) {
  const session = await getAllowedAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { ref } = await params
  const parsed = bodySchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  await updateOrderStatus(ref, parsed.data.status)

  if (parsed.data.status === "delivered") {
    // Kicks off the gift/thank-you tracker for this order.
    await ensureGiftEntry(ref)
  }

  return NextResponse.json({ ok: true })
}
