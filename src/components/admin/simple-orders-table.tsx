"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { AdminOrder } from "./kanban-board"
import { ORDER_PIPELINE } from "@/lib/order-pipeline"
import { ThemedSelect } from "@/components/ui/themed-select"

const STATUS_OPTIONS = [...ORDER_PIPELINE.map((s) => ({ value: s.key, label: s.label })), { value: "cancelled", label: "Cancelled" }]

export function SimpleOrdersTable({ orders: initialOrders }: { orders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [busyRef, setBusyRef] = useState<string | null>(null)

  async function handleStatusChange(ref: string, status: string) {
    const prev = orders
    setBusyRef(ref)
    setOrders((current) => current.map((o) => (o.ref === ref ? { ...o, status } : o)))

    const res = await fetch(`/api/admin/orders/${ref}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) setOrders(prev)
    setBusyRef(null)
  }

  return (
    <div className="overflow-x-auto rounded-[16px] border border-border bg-white">
      <div className="grid min-w-[820px] grid-cols-[1fr_1.4fr_1.6fr_1fr_1fr_1.3fr] gap-3 bg-surface px-4 py-3 font-mono text-[9px] uppercase tracking-[.5px] text-sage">
        <span>Ref</span><span>Customer</span><span>Product</span>
        <span className="text-right">Total</span><span>Channel</span><span>Status</span>
      </div>
      {orders.length === 0 ? (
        <p className="px-4 py-8 text-center font-mono text-[11px] text-sage">No orders yet.</p>
      ) : (
        orders.map((o, i) => {
          const items = Array.isArray(o.items) ? (o.items as Array<{ name?: string }>) : []
          const itemSummary = items.map((it) => it.name).filter(Boolean).join(", ") || "—"
          return (
            <div key={o.id} className={`grid min-w-[820px] grid-cols-[1fr_1.4fr_1.6fr_1fr_1fr_1.3fr] items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
              <span className="font-mono font-bold text-[11.5px] text-forest">{o.ref}</span>
              <span className="truncate text-[12.5px] text-ink">{o.customerName}</span>
              <span className="truncate text-[12px] text-slate">{itemSummary}</span>
              <span className="text-right font-mono text-[12.5px] text-ink">{formatPrice(Number(o.total))}</span>
              <span className={`w-fit rounded-full px-2 py-0.5 font-mono text-[9px] uppercase ${
                o.channel === "showroom" ? "bg-gold/15 text-gold-700" : "bg-forest/10 text-forest"
              }`}>
                {o.channel}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <ThemedSelect
                    value={o.status}
                    onChange={(v) => handleStatusChange(o.ref, v)}
                    options={STATUS_OPTIONS}
                  />
                </div>
                {busyRef === o.ref && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-sage" />}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
