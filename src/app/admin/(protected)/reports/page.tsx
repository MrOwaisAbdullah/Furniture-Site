import { formatPrice } from "@/lib/utils"
import {
  getRevenueStatsByChannel, getAffiliates, getAffiliatePayouts,
  getFunnelCounts, getTrendingProducts, getWishlistCounts, getCartAbandonmentByProduct, getSearchTerms,
} from "@/lib/neon/queries"
import { AiSummaryButton } from "@/components/admin/ai-summary-button"
import { HorizontalBarChart } from "@/components/admin/horizontal-bar-chart"
import { FunnelChart } from "@/components/admin/funnel-chart"

export const dynamic = "force-dynamic"

const FUNNEL_LABELS: Record<string, string> = {
  product_view: "Product viewed",
  add_to_cart: "Added to cart",
  checkout_started: "Checkout started",
  checkout_step_completed: "Checkout step completed",
  order_completed: "Order placed",
}

export default async function AdminReportsPage() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [byChannel, affiliates, payouts, funnelCounts, trending, wishlisted, abandonment, searchTerms] = await Promise.all([
    getRevenueStatsByChannel(monthStart, now),
    getAffiliates(),
    getAffiliatePayouts(),
    getFunnelCounts(monthStart, now),
    getTrendingProducts(7, 8),
    getWishlistCounts(monthStart, now, 8),
    getCartAbandonmentByProduct(monthStart, now, 8),
    getSearchTerms(monthStart, now, 15),
  ])

  const funnelMax = Math.max(1, ...funnelCounts.map((f) => f.sessions))
  const funnel = funnelCounts.map((f, i) => {
    const prevSessions = i > 0 ? funnelCounts[i - 1]!.sessions : f.sessions
    const dropOffPct = prevSessions > 0 ? Math.round((1 - f.sessions / prevSessions) * 100) : 0
    return {
      stage: FUNNEL_LABELS[f.stage] ?? f.stage,
      count: f.sessions,
      pct: Math.round((f.sessions / funnelMax) * 100),
      dropOffPct: i === 0 ? null : dropOffPct,
    }
  })

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
      <p className="font-mono text-[11px] text-sage">{pnlData.month}</p>

      <div className="mt-6">
        <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Revenue by channel</h2>
        <div className="overflow-hidden rounded-[14px] border border-border bg-white">
          <HorizontalBarChart
            data={pnlData.byChannel.map((row) => ({
              label: `${row.channel[0]!.toUpperCase()}${row.channel.slice(1)}`,
              value: row.revenue,
              sublabel: `${row.orders} order${row.orders === 1 ? "" : "s"}`,
              tone: row.channel === "online" ? "default" : "gold",
            }))}
            valueFormatter={(v) => formatPrice(v)}
            emptyMessage="No orders this month yet."
          />
        </div>
        <AiSummaryButton type="pnl" data={pnlData} />
      </div>

      <div className="mt-7">
        <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Affiliate performance</h2>
        <div className="overflow-hidden rounded-[14px] border border-border bg-white">
          <HorizontalBarChart
            data={affiliates.map((a) => ({
              label: a.name,
              value: Number(a.totalEarned),
              sublabel: `${a.totalOrders} order${a.totalOrders === 1 ? "" : "s"}`,
              tone: "gold",
            }))}
            valueFormatter={(v) => formatPrice(v)}
            emptyMessage="No affiliates yet."
          />
        </div>
        <AiSummaryButton type="affiliate" data={affiliateData} />
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-[15px] text-ink">Conversion funnel</h2>
          <span className="font-mono text-[10px] text-sage">This month · by unique session</span>
        </div>
        <div className="mt-3 overflow-hidden rounded-[14px] border border-border bg-white">
          <FunnelChart stages={funnel} />
        </div>
        <AiSummaryButton type="funnel" data={{ funnel }} />
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Trending products</h2>
          <p className="mb-2 font-mono text-[10px] text-sage">Views, last 7 days vs. the 7 before that</p>
          <div className="overflow-hidden rounded-[14px] border border-border bg-white">
            <HorizontalBarChart
              data={trending.map((p) => ({
                label: p.name,
                value: p.recentViews,
                sublabel: `${p.changePct >= 0 ? "+" : ""}${Math.round(p.changePct)}% vs. prior week`,
                tone: p.changePct >= 0 ? "success" : "error",
              }))}
              valueFormatter={(v) => `${v} view${v === 1 ? "" : "s"}`}
              emptyMessage="No product views tracked yet."
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Most wishlisted</h2>
          <p className="mb-2 font-mono text-[10px] text-sage">This month</p>
          <div className="overflow-hidden rounded-[14px] border border-border bg-white">
            <HorizontalBarChart
              data={wishlisted.map((p) => ({ label: p.name, value: p.count, tone: "gold" }))}
              emptyMessage="No wishlist activity tracked yet."
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Cart abandonment by product</h2>
          <p className="mb-2 font-mono text-[10px] text-sage">Added to cart but not purchased, this month</p>
          <div className="overflow-hidden rounded-[14px] border border-border bg-white">
            <HorizontalBarChart
              data={abandonment.map((p) => ({
                label: p.name,
                value: Math.round(p.abandonRate),
                sublabel: `${p.added} added · ${p.purchased} purchased`,
                tone: p.abandonRate >= 50 ? "error" : "default",
              }))}
              valueFormatter={(v) => `${v}%`}
              emptyMessage="No cart activity tracked yet."
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-heading font-bold text-[15px] text-ink">Search terms</h2>
          <p className="mb-2 font-mono text-[10px] text-sage">/shop searches, this month</p>
          <div className="overflow-hidden rounded-[14px] border border-border bg-white">
            <HorizontalBarChart
              data={searchTerms.map((s) => ({
                label: s.term,
                value: s.count,
                sublabel: s.avgResults === 0 ? "0 results — demand gap" : `~${s.avgResults} results`,
                tone: s.avgResults === 0 ? "error" : "default",
              }))}
              valueFormatter={(v) => `${v}×`}
              emptyMessage="No searches tracked yet."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
