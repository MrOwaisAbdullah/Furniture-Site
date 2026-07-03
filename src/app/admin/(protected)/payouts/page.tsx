import { getAffiliatePayouts } from "@/lib/neon/queries"
import { PayoutsList } from "@/components/admin/payouts-list"

export const dynamic = "force-dynamic"

export default async function AdminPayoutsPage() {
  const payouts = await getAffiliatePayouts()
  const owed = payouts.filter((p) => p.payoutStatus === "owed")

  return (
    <div className="p-6">
      <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
        Payouts
      </h1>
      <p className="mt-0.5 font-mono text-[11px] text-sage">{owed.length} owed · {payouts.length} total</p>

      <PayoutsList payouts={payouts} />
    </div>
  )
}
