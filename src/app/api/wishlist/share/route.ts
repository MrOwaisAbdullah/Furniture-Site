import { NextRequest, NextResponse } from "next/server"
import { createWishlistShare, getWishlistByToken } from "@/lib/neon/queries"

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json()
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
  const token = await createWishlistShare(sessionId)
  return NextResponse.json({ token })
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  if (!token) return NextResponse.json({ items: [] })
  const items = await getWishlistByToken(token)
  return NextResponse.json({ items })
}
