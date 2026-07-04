import { TrendingUp, TrendingDown } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export interface Kpi {
  label: string
  value: string
  sub: string
  delta: number | null // percent change vs previous period, null = no comparison available
  dot: string
}

function pct(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null
  return ((current - previous) / previous) * 100
}

export function buildKpis(opts: {
  ordersOnline: number; ordersOnlinePrev: number
  ordersShowroom: number; ordersShowroomPrev: number
  totalOrders: number; totalOrdersPrev: number
  aov: number; aovPrev: number
  revenueOnline: number; revenueOnlinePrev: number
  revenueShowroom: number; revenueShowroomPrev: number
  combinedRevenue: number; combinedRevenuePrev: number
  netProfit: number; netProfitPrev: number
}): Kpi[] {
  const green = "#3E7D6A", gold = "#9c7d2f", ink = "#16352A"
  return [
    { label: "Orders · Online", value: String(opts.ordersOnline), sub: `vs ${opts.ordersOnlinePrev} last period`, delta: pct(opts.ordersOnline, opts.ordersOnlinePrev), dot: green },
    { label: "Orders · Showroom", value: String(opts.ordersShowroom), sub: `vs ${opts.ordersShowroomPrev} last period`, delta: pct(opts.ordersShowroom, opts.ordersShowroomPrev), dot: gold },
    { label: "Total Orders", value: String(opts.totalOrders), sub: `vs ${opts.totalOrdersPrev} last period`, delta: pct(opts.totalOrders, opts.totalOrdersPrev), dot: ink },
    { label: "Avg Order Value", value: formatPrice(opts.aov), sub: `vs ${formatPrice(opts.aovPrev)}`, delta: pct(opts.aov, opts.aovPrev), dot: ink },
    { label: "Revenue · Online", value: formatPrice(opts.revenueOnline), sub: formatPrice(opts.revenueOnline), delta: pct(opts.revenueOnline, opts.revenueOnlinePrev), dot: green },
    { label: "Revenue · Showroom", value: formatPrice(opts.revenueShowroom), sub: formatPrice(opts.revenueShowroom), delta: pct(opts.revenueShowroom, opts.revenueShowroomPrev), dot: gold },
    { label: "Combined Revenue", value: formatPrice(opts.combinedRevenue), sub: formatPrice(opts.combinedRevenue), delta: pct(opts.combinedRevenue, opts.combinedRevenuePrev), dot: ink },
    { label: "Net Revenue", value: formatPrice(opts.netProfit), sub: "After discounts & commissions", delta: pct(opts.netProfit, opts.netProfitPrev), dot: "#C9A24B" },
  ]
}

export function KpiCards({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-[16px] border border-[#E4E0D6] bg-white p-4.5 shadow-[0_1px_2px_rgba(22,53,42,.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: k.dot }} />
              <span className="font-mono text-[10px] uppercase tracking-[.5px] text-sage">{k.label}</span>
            </div>
            {k.delta !== null && (
              <div className={`flex items-center gap-0.5 font-mono text-[10.5px] font-bold ${k.delta >= 0 ? "text-success" : "text-error"}`}>
                {k.delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(k.delta).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="mt-3 font-heading font-black text-[24px] text-forest" style={{ letterSpacing: "-0.5px" }}>{k.value}</p>
          <p className="mt-0.5 text-[11.5px] text-sage">{k.sub}</p>
        </div>
      ))}
    </div>
  )
}
