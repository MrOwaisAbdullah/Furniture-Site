import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { createOrder } from "@/lib/neon/queries"

// Manual order entry — used by admin to log a showroom (in-person) sale so
// the P&L online/showroom split reflects real data.
const manualOrderSchema = z.object({
  customerName:  z.string().min(2).max(100),
  customerPhone: z.string().min(7).max(20),
  items: z.array(z.object({
    name:  z.string().min(1),
    price: z.number().min(0),
    qty:   z.number().int().min(1),
  })).min(1),
  discount:      z.number().min(0).default(0),
  advance:       z.number().min(0),
  paymentMethod: z.enum(["bank", "easypaisa", "cash"]),
  notes:         z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = manualOrderSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data
  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const total = subtotal - data.discount

  const created = await createOrder({
    customerName:  data.customerName,
    customerPhone: data.customerPhone,
    deliveryMethod: "showroom",
    items:         data.items,
    subtotal:      subtotal.toFixed(2),
    discount:      data.discount.toFixed(2),
    advance:       data.advance.toFixed(2),
    total:         total.toFixed(2),
    paymentMethod: data.paymentMethod,
    channel:       "showroom",
    notes:         data.notes,
  })

  if (!created) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }

  return NextResponse.json({ ref: created.ref }, { status: 201 })
}
