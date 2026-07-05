import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getOrderByRef } from "@/lib/neon/queries"

const schema = z.object({
  ref: z.string().min(1),
  phone: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Order reference and phone are required" }, { status: 400 })

  // Checkout stores the phone exactly as the customer typed it — no
  // normalization at write time — so it could be "3XXXXXXXXX",
  // "03XXXXXXXXX", or "+923XXXXXXXXX". Try the plausible variants rather
  // than guessing one canonical form.
  const digits = parsed.data.phone.replace(/\D/g, "") // strips +, spaces, dashes
  const core = digits.replace(/^92/, "").replace(/^0/, "") // bare 3XXXXXXXXX
  const candidates = Array.from(new Set([digits, core, `0${core}`, `+92${core}`, `92${core}`]))

  const ref = parsed.data.ref.trim().toUpperCase()
  let order = null
  for (const candidate of candidates) {
    order = await getOrderByRef(ref, candidate)
    if (order) break
  }

  if (!order) {
    return NextResponse.json({ error: "No order found with that reference and phone number" }, { status: 404 })
  }

  return NextResponse.json({ order })
}
