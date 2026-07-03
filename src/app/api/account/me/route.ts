import { NextRequest, NextResponse } from "next/server"
import { getPortalSession } from "@/lib/redis"
import { getOrdersByPhone, getTargetedCouponsForPhone, getCouponRedemptionsByPhone } from "@/lib/neon/queries"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("account_session")?.value
  if (!token) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const phone = await getPortalSession("account", token)
  if (!phone) return NextResponse.json({ error: "Session expired" }, { status: 401 })

  const [orders, targetedCoupons, redemptions] = await Promise.all([
    getOrdersByPhone(phone),
    getTargetedCouponsForPhone(phone),
    getCouponRedemptionsByPhone(phone),
  ])

  return NextResponse.json({ phone, orders, targetedCoupons, redemptions })
}
