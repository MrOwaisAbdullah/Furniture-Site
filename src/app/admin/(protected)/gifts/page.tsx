import { getGifts } from "@/lib/neon/queries"
import { EmptyState } from "@/components/ui/empty-state"
import { Gift } from "lucide-react"
import { GiftsList } from "@/components/admin/gifts-list"

export const dynamic = "force-dynamic"

export default async function AdminGiftsPage() {
  const gifts = await getGifts()

  return (
    <div className="p-6">
      <p className="font-mono text-[11px] text-sage">Thank-you codes · {gifts.length} delivered orders</p>

      <div className="mt-5">
        {gifts.length === 0 ? (
          <EmptyState
            icon={<Gift className="h-8 w-8 text-slate" />}
            title="No delivered orders yet"
            description="Marking an order as delivered in the Orders kanban creates a gift entry here."
          />
        ) : (
          <GiftsList gifts={gifts} />
        )}
      </div>
    </div>
  )
}
