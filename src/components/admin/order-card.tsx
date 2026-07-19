"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Loader2, Send } from "lucide-react"
import type { AdminOrder } from "./kanban-board"
import { ORDER_PIPELINE } from "@/lib/order-pipeline"
import { ThemedSelect } from "@/components/ui/themed-select"

const STATUS_OPTIONS = [...ORDER_PIPELINE.map((s) => ({ value: s.key, label: s.label })), { value: "cancelled", label: "Cancelled" }]

export function OrderCard({
  order,
  onStatusChange,
}: {
  order: AdminOrder
  onStatusChange: (ref: string, status: string) => Promise<void>
}) {
  const [updating, setUpdating] = useState(false)
  const [sendingThanks, setSendingThanks] = useState(false)
  const items = Array.isArray(order.items) ? order.items as Array<{ name?: string; qty?: number }> : []
  const itemSummary = items.map((i) => i.name).filter(Boolean).join(", ") || "—"

  async function handleChange(next: string) {
    setUpdating(true)
    await onStatusChange(order.ref, next)
    setUpdating(false)
  }

  async function handleSendThankYou() {
    setSendingThanks(true)
    try {
      const res = await fetch("/api/admin/send-thank-you", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderRef: order.ref }),
      })
      const body = await res.json()
      if (res.ok) {
        alert(`Thank-you sent!\nCode: ${body.referralCode}`)
      } else {
        alert(body.error ?? "Failed")
      }
    } catch {
      alert("Network error")
    }
    setSendingThanks(false)
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
        <div className="flex-1">
          <ThemedSelect value={order.status} onChange={handleChange} options={STATUS_OPTIONS} />
        </div>
        {updating && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-sage" />}
      </div>
      {order.customerEmail && (
        <button
          onClick={handleSendThankYou}
          disabled={sendingThanks}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-border py-1.5 font-heading text-[11px] font-bold text-slate transition-colors hover:bg-forest/5 hover:text-forest disabled:opacity-40"
        >
          {sendingThanks ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
          Send thank-you
        </button>
      )}
    </div>
  )
}
