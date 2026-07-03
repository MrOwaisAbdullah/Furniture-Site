import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { createCoupon, toggleCouponActive } from "@/lib/neon/queries"

const createSchema = z.object({
  code:          z.string().min(3).max(30),
  type:          z.enum(["percent", "flat"]),
  value:         z.number().min(0),
  minOrderValue: z.number().min(0).optional(),
  maxUses:       z.number().int().min(1).optional(),
  perUserLimit:  z.number().int().min(1).optional(),
  combinable:    z.boolean().default(false),
  expiresAt:     z.string().optional(),
  notes:         z.string().optional(),
  targetPhone:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data
  const created = await createCoupon({
    code:          data.code,
    type:          data.type,
    value:         String(data.value),
    minOrderValue: data.minOrderValue !== undefined ? String(data.minOrderValue) : undefined,
    maxUses:       data.maxUses,
    perUserLimit:  data.perUserLimit,
    combinable:    data.combinable,
    expiresAt:     data.expiresAt ? new Date(data.expiresAt) : undefined,
    notes:         data.notes,
    targetPhone:   data.targetPhone,
  })

  if (!created) {
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
  }

  return NextResponse.json({ id: created.id, code: data.code.toUpperCase() }, { status: 201 })
}

const toggleSchema = z.object({ id: z.number(), active: z.boolean() })

export async function PATCH(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = toggleSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 })
  }

  await toggleCouponActive(parsed.data.id, parsed.data.active)
  return NextResponse.json({ ok: true })
}
