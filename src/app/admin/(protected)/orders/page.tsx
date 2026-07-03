import { getOrders } from "@/lib/neon/queries"
import { KanbanBoard } from "@/components/admin/kanban-board"
import { OrdersPageHeader } from "./orders-page-header"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const orders = await getOrders(200)

  return (
    <div className="p-6">
      <OrdersPageHeader count={orders.length} />
      <div className="mt-5">
        <KanbanBoard orders={orders} />
      </div>
    </div>
  )
}
