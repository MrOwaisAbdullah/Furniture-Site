"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { NewOrderForm } from "@/components/admin/new-order-form"

export function OrdersPageHeader({ count }: { count: number }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <p className="font-mono text-[11px] text-sage">{count} orders</p>
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
