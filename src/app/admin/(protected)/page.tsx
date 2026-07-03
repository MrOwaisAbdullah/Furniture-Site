import { Suspense } from "react"
import { KpiCards } from "@/components/admin/kpi-cards"
import { DateRangeTabs } from "@/components/admin/date-range-tabs"
import { formatPrice } from "@/lib/utils"
import { getRevenueStats, getRevenueStatsByChannel } from "@/lib/neon/queries"

export const dynamic = "force-dynamic"

function resolveRange(range: string | undefined): { from: Date; to: Date; label: string } {
  const now = new Date()
  if (range === "last_month") {
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    return { from, to, label: from.toLocaleString("en-US", { month: "long", year: "numeric" }) }
  }
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
  return { from, to: now, label: now.toLocaleString("en-US", { month: "long", year: "numeric" }) }
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { range } = await searchParams
  const { from, to, label } = resolveRange(range)

  const [combined, byChannel] = await Promise.all([
    getRevenueStats(from, to),
    getRevenueStatsByChannel(from, to),
  ])

  const orderCount = Number(combined?.count ?? 0)
  const revenue = Number(combined?.total ?? 0)
  const avgOrderValue = Number(combined?.avg ?? 0)

  const online = byChannel.find((r) => r.channel === "online")
  const showroom = byChannel.find((r) => r.channel === "showroom")
  const totalDiscount = byChannel.reduce((sum, r) => sum + Number(r.discount ?? 0), 0)
  const totalCommission = byChannel.reduce((sum, r) => sum + Number(r.affiliateCommission ?? 0), 0)
  const netRevenue = revenue - totalDiscount - totalCommission

  const channelRows = [
    { label: "Revenue", online: Number(online?.total ?? 0), showroom: Number(showroom?.total ?? 0) },
    { label: "Orders", online: Number(online?.count ?? 0), showroom: Number(showroom?.count ?? 0), isCount: true },
    { label: "Coupon discounts", online: -Number(online?.discount ?? 0), showroom: -Number(showroom?.discount ?? 0) },
    { label: "Affiliate commissions", online: -Number(online?.affiliateCommission ?? 0), showroom: -Number(showroom?.affiliateCommission ?? 0) },
  ]

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
            Dashboard
          </h1>
          <p className="mt-0.5 font-mono text-[11px] text-sage">{label}</p>
        </div>
        <Suspense fallback={null}>
          <DateRangeTabs />
        </Suspense>
      </div>

      <div className="mt-5">
        <KpiCards orderCount={orderCount} revenue={revenue} avgOrderValue={avgOrderValue} netRevenue={netRevenue} />
      </div>

      <div className="mt-7">
        <h2 className="mb-3 font-heading font-bold text-[16px] text-ink">Online vs showroom</h2>
        <div className="overflow-hidden rounded-[14px] border border-border bg-white">
          <div className="grid grid-cols-4 gap-2 border-b border-border bg-surface px-4 py-2.5">
            <span className="font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Metric</span>
            <span className="text-right font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Online</span>
            <span className="text-right font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Showroom</span>
            <span className="text-right font-mono text-[10.5px] uppercase tracking-[1px] text-sage">Combined</span>
          </div>
          {channelRows.map((row) => (
            <div key={row.label} className="grid grid-cols-4 gap-2 border-b border-border px-4 py-3 last:border-0">
              <span className="text-[13px] text-slate">{row.label}</span>
              <span className="text-right font-mono text-[12.5px] text-ink">
                {row.isCount ? row.online : formatPrice(row.online)}
              </span>
              <span className="text-right font-mono text-[12.5px] text-ink">
                {row.isCount ? row.showroom : formatPrice(row.showroom)}
              </span>
              <span className="text-right font-mono text-[12.5px] font-bold text-forest">
                {row.isCount ? row.online + row.showroom : formatPrice(row.online + row.showroom)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-[10px] bg-info/8 px-3.5 py-2.5 text-[12px] text-info">
          Cost of goods and net profit require cost sheet data — set up material rates and piece costs on{" "}
          <a href="/admin/costs" className="underline underline-offset-2">the Cost Sheet page</a> to see gross/net margin here.
        </p>
      </div>
    </div>
  )
}
