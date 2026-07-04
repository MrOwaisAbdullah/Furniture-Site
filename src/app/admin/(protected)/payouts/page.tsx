import { getAffiliatePayouts } from "@/lib/neon/queries"
import { PayoutsList } from "@/components/admin/payouts-list"

export const dynamic = "force-dynamic"

export default async function AdminPayoutsPage() {
  const payouts = await getAffiliatePayouts()
  const owed = payouts.filter((p) => p.payoutStatus === "owed")

  return (
    <div className="p-6">
      <p className="font-mono text-[11px] text-sage">{owed.length} owed · {payouts.length} total</p>

      <PayoutsList payouts={payouts} />
    </div>
  )
}
