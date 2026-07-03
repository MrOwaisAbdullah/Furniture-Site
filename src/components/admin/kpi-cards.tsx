import { TrendingUp, ShoppingBag, BarChart3, DollarSign } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export function KpiCards({
  orderCount,
  revenue,
  avgOrderValue,
  netRevenue,
}: {
  orderCount: number
  revenue: number
  avgOrderValue: number
  netRevenue: number
}) {
  const kpis = [
    {
      label: "Orders this period",
      value: String(orderCount),
      sub: "Online + showroom",
      icon: ShoppingBag,
      color: "#16352A",
    },
    {
      label: "Revenue",
      value: formatPrice(revenue),
      sub: "Gross, this period",
      icon: DollarSign,
      color: "#C9A24B",
    },
    {
      label: "Avg order value",
      value: formatPrice(avgOrderValue),
      sub: "Per booking",
      icon: BarChart3,
      color: "#3A6B7A",
    },
    {
      label: "Net revenue",
      value: formatPrice(netRevenue),
      sub: "After discounts + commissions",
      icon: TrendingUp,
      color: "#3E7D5A",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map(({ label, value, sub, icon: Icon, color }) => (
        <div key={label} className="rounded-[14px] border border-border bg-white p-4">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[9px]"
            style={{ background: color + "18" }}
          >
            <Icon className="h-4.5 w-4.5" style={{ stroke: color }} strokeWidth={2} />
          </div>
          <p className="mt-3 font-mono font-bold text-[20px] text-ink">{value}</p>
          <p className="mt-0.5 text-[12px] text-slate">{label}</p>
          <p className="mt-1 font-mono text-[10px] text-sage">{sub}</p>
        </div>
      ))}
    </div>
  )
}
