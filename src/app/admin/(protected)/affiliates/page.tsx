import { getAffiliates } from "@/lib/neon/queries"
import { AffiliatesManager } from "@/components/admin/affiliates-manager"

export const dynamic = "force-dynamic"

export default async function AdminAffiliatesPage() {
  const affiliates = await getAffiliates()

  return (
    <div className="p-6">
      <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
        Affiliates
      </h1>
      <p className="mt-0.5 font-mono text-[11px] text-sage">
        {affiliates.filter((a) => !a.approvedAt).length} pending · {affiliates.filter((a) => a.approvedAt).length} approved
      </p>

      <AffiliatesManager affiliates={affiliates} />
    </div>
  )
}
