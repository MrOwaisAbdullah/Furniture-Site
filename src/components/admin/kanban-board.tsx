"use client"

import { useState } from "react"
import { OrderCard } from "./order-card"

export interface AdminOrder {
  id: number
  ref: string
  customerName: string
  customerPhone: string
  items: unknown
  total: string
  advance: string
  status: string
  channel: string
  couponCode: string | null
  affiliateCode: string | null
  paymentMethod: string
  paymentScreenshot: string | null
  createdAt: Date | string
}

export const ORDER_PIPELINE = [
  { key: "payment_pending",   label: "Pending Payment" },
  { key: "payment_confirmed", label: "Payment Confirmed" },
  { key: "building",          label: "Workshop Building" },
  { key: "polishing",         label: "Polishing / Deco" },
  { key: "finishing",         label: "Final Finishing" },
  { key: "ready",             label: "Ready for Delivery" },
  { key: "delivered",         label: "Delivered" },
]

interface KanbanBoardProps {
  orders: AdminOrder[]
}

export function KanbanBoard({ orders: initialOrders }: KanbanBoardProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [showCancelled, setShowCancelled] = useState(false)

  async function handleStatusChange(ref: string, status: string) {
    const prev = orders
    setOrders((current) => current.map((o) => (o.ref === ref ? { ...o, status } : o)))

    const res = await fetch(`/api/admin/orders/${ref}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (!res.ok) {
      // Roll back on failure — the mutation didn't actually take.
      setOrders(prev)
    }
  }

  const cancelledOrders = orders.filter((o) => o.status === "cancelled")

  if (showCancelled) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setShowCancelled(false)}
          className="mb-4 font-mono text-[11px] text-forest underline underline-offset-2"
        >
          ← Back to pipeline
        </button>
        <div className="flex flex-col gap-2">
          {cancelledOrders.length === 0 ? (
            <p className="font-mono text-[11px] text-sage">No cancelled orders</p>
          ) : (
            cancelledOrders.map((o) => (
              <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} />
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setShowCancelled(true)}
          className="font-mono text-[11px] text-slate underline underline-offset-2 hover:text-ink"
        >
          View cancelled ({cancelledOrders.length})
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {ORDER_PIPELINE.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key)
          return (
            <div key={col.key} className="flex shrink-0 flex-col gap-2.5 w-[220px]">
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold text-[12.5px] text-ink">{col.label}</p>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-mist font-mono text-[10px] text-slate px-1">
                  {colOrders.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {colOrders.length === 0 ? (
                  <div className="rounded-[12px] border border-dashed border-border py-6 text-center">
                    <p className="font-mono text-[10px] text-sage">Empty</p>
                  </div>
                ) : (
                  colOrders.map((o) => (
                    <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
