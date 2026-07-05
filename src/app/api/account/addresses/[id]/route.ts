import { NextRequest, NextResponse } from "next/server"
import { getPortalSession } from "@/lib/redis"
import { deleteAddress, setDefaultAddress } from "@/lib/neon/queries"

async function requirePhone(req: NextRequest) {
  const token = req.cookies.get("account_session")?.value
  if (!token) return null
  return getPortalSession("account", token)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const phone = await requirePhone(req)
  if (!phone) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const { id } = await params
  await deleteAddress(Number(id), phone)
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const phone = await requirePhone(req)
  if (!phone) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const { id } = await params
  await setDefaultAddress(Number(id), phone)
  return NextResponse.json({ ok: true })
}
