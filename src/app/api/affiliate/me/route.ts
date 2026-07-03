import { NextRequest, NextResponse } from "next/server"
import { getPortalSession } from "@/lib/redis"
import { getAffiliateById, getAffiliatePayoutsByAffiliate } from "@/lib/neon/queries"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("affiliate_session")?.value
  if (!token) return NextResponse.json({ error: "Not signed in" }, { status: 401 })

  const affiliateId = await getPortalSession("affiliate", token)
  if (!affiliateId) return NextResponse.json({ error: "Session expired" }, { status: 401 })

  const affiliate = await getAffiliateById(Number(affiliateId))
  if (!affiliate) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const payouts = await getAffiliatePayoutsByAffiliate(affiliate.id)

  return NextResponse.json({
    name: affiliate.name,
    referralCode: affiliate.referralCode,
    commissionPct: affiliate.commissionPct,
    totalOrders: affiliate.totalOrders,
    totalEarned: affiliate.totalEarned,
    totalPaid: affiliate.totalPaid,
    payouts,
  })
}
