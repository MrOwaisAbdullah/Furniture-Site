"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import type { AdminOrder } from "./kanban-board"
import { ORDER_PIPELINE } from "./kanban-board"

export function OrderCard({
  order,
  onStatusChange,
}: {
  order: AdminOrder
  onStatusChange: (ref: string, status: string) => Promise<void>
}) {
  const [updating, setUpdating] = useState(false)
  const items = Array.isArray(order.items) ? order.items as Array<{ name?: string; qty?: number }> : []
  const itemSummary = items.map((i) => i.name).filter(Boolean).join(", ") || "—"

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    setUpdating(true)
    await onStatusChange(order.ref, next)
    setUpdating(false)
  }

  return (
    <div className="rounded-[12px] border border-border bg-white p-3.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono font-bold text-[12px] text-forest">{order.ref}</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[1px]",
            order.channel === "showroom" ? "bg-gold/15 text-gold-700" : "bg-forest/10 text-forest"
          )}
        >
          {order.channel}
        </span>
      </div>
      <p className="mt-1.5 font-heading font-bold text-[13px] text-ink">{order.customerName}</p>
      <p className="mt-0.5 text-[11.5px] text-slate line-clamp-1">{itemSummary}</p>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="font-mono text-[12px] text-gold-700">{formatPrice(Number(order.total))}</span>
        {(order.couponCode || order.affiliateCode) && (
          <span className="font-mono text-[10px] text-info">{order.couponCode || order.affiliateCode}</span>
        )}
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <select
          value={order.status}
          onChange={handleChange}
          disabled={updating}
          className="w-full rounded-[8px] border border-border-strong bg-surface px-2 py-1.5 text-[11px] text-ink focus:border-forest focus:outline-none disabled:opacity-60"
        >
          {ORDER_PIPELINE.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
          <option value="cancelled">Cancelled</option>
        </select>
        {updating && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-sage" />}
      </div>
    </div>
  )
}
