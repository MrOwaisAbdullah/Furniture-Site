import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/neon"
import { wishlistItems } from "@/lib/neon/schema"
import { eq, and } from "drizzle-orm"

const addSchema = z.object({
  sessionId:   z.string().min(1),
  productId:   z.string().min(1),
  productName: z.string().min(1),
  productSlug: z.string().min(1),
  price:       z.number().min(0),
  finishName:  z.string().optional(),
})

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId")
  if (!sessionId) return NextResponse.json({ items: [] })
  const items = await db.select({
    productId:   wishlistItems.productId,
    productName: wishlistItems.productName,
    productSlug: wishlistItems.productSlug,
    price:       wishlistItems.price,
    finishName:  wishlistItems.finishName,
  }).from(wishlistItems).where(eq(wishlistItems.sessionId, sessionId))
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = addSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 })
  await db.insert(wishlistItems).values({ ...parsed.data, price: parsed.data.price.toFixed(2) }).onConflictDoNothing()
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const { sessionId, productId } = await req.json()
  if (!sessionId || !productId) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  await db.delete(wishlistItems).where(and(eq(wishlistItems.sessionId, sessionId), eq(wishlistItems.productId, productId)))
  return NextResponse.json({ ok: true })
}
