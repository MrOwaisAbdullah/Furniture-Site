import { Suspense } from "react"
import { KpiCards, buildKpis } from "@/components/admin/kpi-cards"
import { DateRangeTabs } from "@/components/admin/date-range-tabs"
import { MarginHealthBanner } from "@/components/admin/margin-health-banner"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { StatusBars } from "@/components/admin/status-bars"
import { TopProductsCard } from "@/components/admin/top-products-card"
import { CouponRoiCard } from "@/components/admin/coupon-roi-card"
import { formatPrice } from "@/lib/utils"
import {
  getRevenueStats, getRevenueStatsByChannel, getWeeklyRevenue,
  getOrderStatusCounts, getTopProductsByRevenue, getCouponROI,
} from "@/lib/neon/queries"

export const dynamic = "force-dynamic"

const MARGIN_TARGET_PCT = 15

function resolveRange(range: string | undefined) {
  const now = new Date()
  let from: Date, to: Date, label: string

  if (range === "last_month") {
    from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    label = from.toLocaleString("en-US", { month: "long", year: "numeric" })
  } else {
    from = new Date(now.getFullYear(), now.getMonth(), 1)
    to = now
    label = now.toLocaleString("en-US", { month: "long", year: "numeric" })
  }

  const spanMs = to.getTime() - from.getTime()
  const prevTo = new Date(from.getTime() - 1)
  const prevFrom = new Date(prevTo.getTime() - spanMs)

  return { from, to, label, prevFrom, prevTo }
}

function channelTotal(byChannel: { channel: string; total: string; count: number; discount: string; affiliateCommission: string }[], channel: string) {
  return byChannel.find((r) => r.channel === channel)
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { range } = await searchParams
  const { from, to, label, prevFrom, prevTo } = resolveRange(range)

  const [
    combined, byChannel, prevCombined, prevByChannel,
    weeklyRevenue, statusCounts, topProducts, couponROI,
  ] = await Promise.all([
    getRevenueStats(from, to),
    getRevenueStatsByChannel(from, to),
    getRevenueStats(prevFrom, prevTo),
    getRevenueStatsByChannel(prevFrom, prevTo),
    getWeeklyRevenue(from, to),
    getOrderStatusCounts(),
    getTopProductsByRevenue(from, to, 5),
    getCouponROI(from, to),
  ])

  const orderCount = Number(combined?.count ?? 0)
  const revenue = Number(combined?.total ?? 0)
  const avgOrderValue = Number(combined?.avg ?? 0)
  const prevOrderCount = Number(prevCombined?.count ?? 0)
  const prevRevenue = Number(prevCombined?.total ?? 0)
  const prevAvgOrderValue = Number(prevCombined?.avg ?? 0)

  const online = channelTotal(byChannel, "online")
  const showroom = channelTotal(byChannel, "showroom")
  const prevOnline = channelTotal(prevByChannel, "online")
  const prevShowroom = channelTotal(prevByChannel, "showroom")

  const totalDiscount = byChannel.reduce((sum, r) => sum + Number(r.discount ?? 0), 0)
  const totalCommission = byChannel.reduce((sum, r) => sum + Number(r.affiliateCommission ?? 0), 0)
  const netRevenue = revenue - totalDiscount - totalCommission
  const prevTotalDiscount = prevByChannel.reduce((sum, r) => sum + Number(r.discount ?? 0), 0)
  const prevTotalCommission = prevByChannel.reduce((sum, r) => sum + Number(r.affiliateCommission ?? 0), 0)
  const prevNetRevenue = prevRevenue - prevTotalDiscount - prevTotalCommission
  const netMarginPct = revenue > 0 ? (netRevenue / revenue) * 100 : 0

  const kpis = buildKpis({
    ordersOnline: Number(online?.count ?? 0), ordersOnlinePrev: Number(prevOnline?.count ?? 0),
    ordersShowroom: Number(showroom?.count ?? 0), ordersShowroomPrev: Number(prevShowroom?.count ?? 0),
    totalOrders: orderCount, totalOrdersPrev: prevOrderCount,
    aov: avgOrderValue, aovPrev: prevAvgOrderValue,
    revenueOnline: Number(online?.total ?? 0), revenueOnlinePrev: Number(prevOnline?.total ?? 0),
    revenueShowroom: Number(showroom?.total ?? 0), revenueShowroomPrev: Number(prevShowroom?.total ?? 0),
    combinedRevenue: revenue, combinedRevenuePrev: prevRevenue,
    netProfit: netRevenue, netProfitPrev: prevNetRevenue,
  })

  const channelRows = [
    { label: "Revenue", online: Number(online?.total ?? 0), showroom: Number(showroom?.total ?? 0) },
    { label: "Orders", online: Number(online?.count ?? 0), showroom: Number(showroom?.count ?? 0), isCount: true },
    { label: "Coupon discounts", online: -Number(online?.discount ?? 0), showroom: -Number(showroom?.discount ?? 0) },
    { label: "Affiliate commissions", online: -Number(online?.affiliateCommission ?? 0), showroom: -Number(showroom?.affiliateCommission ?? 0) },
    { label: "Net revenue", online: Number(online?.total ?? 0) - Number(online?.discount ?? 0) - Number(online?.affiliateCommission ?? 0), showroom: Number(showroom?.total ?? 0) - Number(showroom?.discount ?? 0), bold: true },
  ]

  // Weekly revenue buckets → chart points, online/showroom side by side.
  const weekMap = new Map<string, { online: number; showroom: number }>()
  for (const row of weeklyRevenue) {
    const entry = weekMap.get(row.week) ?? { online: 0, showroom: 0 }
    if (row.channel === "online") entry.online += Number(row.total)
    else if (row.channel === "showroom") entry.showroom += Number(row.total)
    weekMap.set(row.week, entry)
  }
  const weeks = Array.from(weekMap.entries()).map(([week, v]) => ({ week, ...v })).sort((a, b) => a.week.localeCompare(b.week))

  const statusCountMap = Object.fromEntries(statusCounts.map((s) => [s.status, Number(s.count)]))

  const topProductsData = topProducts.map((p) => ({ name: p.name, revenue: Number(p.revenue) }))
  const couponROIData = couponROI.map((c) => ({ code: c.code, discount: Number(c.discount), revenue: Number(c.revenue) }))

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-sage">{label}</p>
        <Suspense fallback={null}>
          <DateRangeTabs />
        </Suspense>
      </div>

      <div className="mt-5">
        <MarginHealthBanner netMarginPct={netMarginPct} targetPct={MARGIN_TARGET_PCT} />
        <KpiCards kpis={kpis} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[16px] border border-[#E4E0D6] bg-white p-5.5 shadow-[0_1px_2px_rgba(22,53,42,.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading font-black text-[16px] text-ink">Profit &amp; Loss</h2>
            <span className="font-mono text-[10px] text-sage">{label} · PKR</span>
          </div>
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-y-1 text-[12px]">
            <span></span>
            <span className="pb-2 text-right font-mono text-[9px] uppercase tracking-[1px] text-success">Online</span>
            <span className="pb-2 text-right font-mono text-[9px] uppercase tracking-[1px] text-gold-700">Showroom</span>
            <span className="pb-2 text-right font-mono text-[9px] uppercase tracking-[1px] text-forest">Combined</span>
            {channelRows.map((row) => (
              <div key={row.label} className="col-span-4 grid grid-cols-subgrid border-t border-[#F0ECE3] py-1.5">
                <span className={row.bold ? "font-heading font-bold text-forest" : "text-slate"}>{row.label}</span>
                <span className={`text-right font-mono ${row.bold ? "font-bold text-forest" : row.online < 0 ? "text-error" : "text-ink"}`}>
                  {row.isCount ? row.online : formatPrice(row.online)}
                </span>
                <span className={`text-right font-mono ${row.bold ? "font-bold text-forest" : row.showroom < 0 ? "text-error" : "text-ink"}`}>
                  {row.isCount ? row.showroom : formatPrice(row.showroom)}
                </span>
                <span className="text-right font-mono font-bold text-forest">
                  {row.isCount ? row.online + row.showroom : formatPrice(row.online + row.showroom)}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-[10px] bg-info/8 px-3 py-2 text-[11px] text-info">
            Cost of goods, delivery, returns and marketing spend aren&apos;t tracked per-order yet — set per-product costs on{" "}
            <a href="/admin/costs" className="underline underline-offset-2">the Cost Sheet page</a> to unlock gross profit here.
          </p>
        </div>

        <div className="rounded-[16px] border border-[#E4E0D6] bg-white p-5.5 shadow-[0_1px_2px_rgba(22,53,42,.04)]">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-heading font-black text-[16px] text-ink">Revenue over time</h2>
          </div>
          <div className="mb-3.5 flex gap-4">
            <div className="flex items-center gap-1.5"><span className="h-[3px] w-2.5 rounded-full bg-success" /><span className="text-[11px] text-slate">Online</span></div>
            <div className="flex items-center gap-1.5"><span className="h-[3px] w-2.5 rounded-full bg-gold" /><span className="text-[11px] text-slate">Showroom</span></div>
            <span className="ml-auto font-mono text-[10px] text-sage">This period, weekly</span>
          </div>
          <RevenueChart weeks={weeks} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-[16px] border border-[#E4E0D6] bg-white p-5.5 shadow-[0_1px_2px_rgba(22,53,42,.04)]">
          <h2 className="mb-5 font-heading font-black text-[16px] text-ink">Orders by status</h2>
          <StatusBars counts={statusCountMap} />
        </div>
        <TopProductsCard products={topProductsData} />
        <CouponRoiCard coupons={couponROIData} />
      </div>
    </div>
  )
}
