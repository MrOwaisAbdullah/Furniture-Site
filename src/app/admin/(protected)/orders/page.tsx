import { getOrders } from "@/lib/neon/queries"
import { OrdersViewSwitcher } from "@/components/admin/orders-view-switcher"
import { OrdersPageHeader } from "./orders-page-header"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const orders = await getOrders(200)

  return (
    <div className="p-6">
      <OrdersPageHeader count={orders.length} />
      <div className="mt-5">
        <OrdersViewSwitcher orders={orders} />
      </div>
    </div>
  )
}
