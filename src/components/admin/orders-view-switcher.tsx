"use client"

import { useState } from "react"
import { KanbanBoard, type AdminOrder } from "./kanban-board"
import { SimpleOrdersTable } from "./simple-orders-table"

export function OrdersViewSwitcher({ orders }: { orders: AdminOrder[] }) {
  const [view, setView] = useState<"kanban" | "simple">("kanban")

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-[10px] border border-border bg-white p-1" style={{ width: "fit-content" }}>
        {(["kanban", "simple"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-[7px] px-4 py-2 font-heading font-bold text-[12px] transition-colors ${
              view === v ? "bg-forest text-bone" : "text-slate hover:bg-surface"
            }`}
          >
            {v === "kanban" ? "Kanban" : "Simple"}
          </button>
        ))}
      </div>

      {view === "kanban" ? <KanbanBoard orders={orders} /> : <SimpleOrdersTable orders={orders} />}
    </div>
  )
}
