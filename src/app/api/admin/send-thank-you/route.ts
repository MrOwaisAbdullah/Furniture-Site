import { NextRequest, NextResponse } from "next/server"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { sendThankYouEmail } from "@/lib/email"
import { getAdminOrderByRef } from "@/lib/neon/queries"
import { nanoid } from "nanoid"

export async function POST(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { orderRef } = await req.json()
    if (!orderRef) {
      return NextResponse.json({ error: "orderRef is required" }, { status: 400 })
    }

    const order = await getAdminOrderByRef(orderRef)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (!order.customerEmail) {
      return NextResponse.json({ error: "Customer has no email on file" }, { status: 400 })
    }

    const referralCode = `YL-${nanoid(6).toUpperCase()}`

    await sendThankYouEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      referralCode,
    })

    return NextResponse.json({ sent: true, referralCode })
  } catch (err) {
    console.error("[send-thank-you] error", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
