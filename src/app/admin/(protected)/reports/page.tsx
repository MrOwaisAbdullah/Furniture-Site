import { formatPrice } from "@/lib/utils"
import { getRevenueStatsByChannel, getAffiliates, getAffiliatePayouts } from "@/lib/neon/queries"
import { AiSummaryButton } from "@/components/admin/ai-summary-button"

export const dynamic = "force-dynamic"

const funnel = [
  { stage: "Homepage visits", count: 1840, pct: 100 },
  { stage: "Product viewed", count: 920, pct: 50 },
  { stage: "WhatsApp clicked", count: 138, pct: 7.5 },
  { stage: "Checkout started", count: 46, pct: 2.5 },
  { stage: "Orders placed", count: 14, pct: 0.76 },
]

export default async function AdminReportsPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [byChannel, affiliates, payouts] = await Promise.all([
    getRevenueStatsByChannel(monthStart, now),
    getAffiliates(),
    getAffiliatePayouts(),
  ])

  const pnlData = {
    month: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
    byChannel: byChannel.map((r) => ({
      channel: r.channel, revenue: Number(r.total), orders: Number(r.count),
      discount: Number(r.discount), affiliateCommission: Number(r.affiliateCommission),
    })),
  }

  const affiliateData = {
    affiliates: affiliates.map((a) => ({
      name: a.name, totalOrders: a.totalOrders, totalEarned: Number(a.totalEarned),
      totalPaid: Number(a.totalPaid), active: a.active,
    })),
    payoutsOwed: payouts.filter((p) => p.payoutStatus === "owed").length,
  }

  return (
    <div className="p-6">
      <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
        Reports
      </h1>
      <p className="mt-0.5 font-mono text-[11px] text-sage">{pnlData.month}</p>

      <div className="mt-6">
        <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Revenue by channel</h2>
        <div className="overflow-hidden rounded-[14px] border border-border bg-white">
          {pnlData.byChannel.length === 0 ? (
            <p className="px-4 py-6 text-center font-mono text-[11px] text-sage">No orders this month yet.</p>
          ) : (
            pnlData.byChannel.map((row, i) => (
              <div key={row.channel} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className="text-[13px] capitalize text-slate">{row.channel}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-sage">{row.orders} orders</span>
                  <span className="font-mono font-bold text-[13px] text-ink">{formatPrice(row.revenue)}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <AiSummaryButton type="pnl" data={pnlData} />
      </div>

      <div className="mt-7">
        <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Affiliate performance</h2>
        <div className="overflow-hidden rounded-[14px] border border-border bg-white">
          {affiliates.length === 0 ? (
            <p className="px-4 py-6 text-center font-mono text-[11px] text-sage">No affiliates yet.</p>
          ) : (
            affiliates.map((a, i) => (
              <div key={a.id} className={`flex items-center justify-between px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className="text-[13px] text-ink">{a.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-sage">{a.totalOrders} orders</span>
                  <span className="font-mono font-bold text-[13px] text-gold-700">{formatPrice(Number(a.totalEarned))}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <AiSummaryButton type="affiliate" data={affiliateData} />
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-[15px] text-ink">Conversion funnel</h2>
          <span className="font-mono text-[10px] text-sage">Illustrative — needs event tracking pipeline</span>
        </div>
        <div className="mt-3 overflow-hidden rounded-[14px] border border-border bg-white">
          {funnel.map((row, i) => (
            <div key={row.stage} className={`px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate">{row.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] text-sage">{row.pct}%</span>
                  <span className="font-mono font-bold text-[13px] text-ink">{row.count.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${row.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
