import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getPortalSession } from "@/lib/redis"
import { getAddressesByPhone, createAddress } from "@/lib/neon/queries"

const addressSchema = z.object({
  label: z.string().min(1).max(50),
  area: z.string().max(100).optional(),
  address: z.string().min(5).max(500),
  isDefault: z.boolean().optional(),
})

async function requirePhone(req: NextRequest) {
  const token = req.cookies.get("account_session")?.value
  if (!token) return null
  return getPortalSession("account", token)
}

export async function GET(req: NextRequest) {
  const phone = await requirePhone(req)
  if (!phone) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const addresses = await getAddressesByPhone(phone)
  return NextResponse.json({ addresses })
}

export async function POST(req: NextRequest) {
  const phone = await requirePhone(req)
  if (!phone) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const parsed = addressSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const created = await createAddress({ phone, ...parsed.data })
  return NextResponse.json({ ok: true, id: created?.id })
}
