import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { upsertMaterialRate, upsertPieceCost, upsertCategoryCost, setCostMode } from "@/lib/neon/queries"

const payloadSchema = z.object({
  rates: z.array(z.object({
    key: z.string(), label: z.string(), rate: z.number().min(0), unit: z.string(),
  })).optional(),
  pieces: z.array(z.object({
    pieceType: z.string(), label: z.string(),
    sheets16mm: z.number().min(0), thinSheets: z.number().min(0),
    thapary: z.boolean(), foam: z.boolean(), mirror: z.boolean(),
    hardwareCost: z.number().min(0), labourCost: z.number().min(0), decoCost: z.number().min(0),
  })).optional(),
  categories: z.array(z.object({
    categorySlug: z.string(), manufacturingCost: z.number().min(0), showroomMarginPct: z.number().min(0),
  })).optional(),
  modes: z.array(z.object({
    categorySlug: z.string(), mode: z.enum(["average", "per_product"]),
  })).optional(),
})

export async function PUT(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = payloadSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data

  await Promise.all([
    ...(data.rates ?? []).map((r) => upsertMaterialRate(r.key, r.label, String(r.rate), r.unit)),
    ...(data.pieces ?? []).map((p) => upsertPieceCost({
      pieceType: p.pieceType, label: p.label,
      sheets16mm: String(p.sheets16mm), thinSheets: String(p.thinSheets),
      thapary: p.thapary, foam: p.foam, mirror: p.mirror,
      hardwareCost: String(p.hardwareCost), labourCost: String(p.labourCost), decoCost: String(p.decoCost),
    })),
    ...(data.categories ?? []).map((c) => upsertCategoryCost(c.categorySlug, String(c.manufacturingCost), String(c.showroomMarginPct))),
    ...(data.modes ?? []).map((m) => setCostMode(m.categorySlug, m.mode)),
  ])

  return NextResponse.json({ ok: true })
}
