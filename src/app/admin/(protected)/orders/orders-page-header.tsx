"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { NewOrderForm } from "@/components/admin/new-order-form"

export function OrdersPageHeader({ count }: { count: number }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
          Orders
        </h1>
        <p className="mt-0.5 font-mono text-[11px] text-sage">{count} orders</p>
      </div>
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-forest px-3.5 font-heading font-bold text-[12.5px] text-bone"
      >
        <Plus className="h-4 w-4" /> Log showroom order
      </button>
      {showForm && <NewOrderForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
