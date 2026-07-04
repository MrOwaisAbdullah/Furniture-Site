import { getAffiliates } from "@/lib/neon/queries"
import { AffiliatesManager } from "@/components/admin/affiliates-manager"

export const dynamic = "force-dynamic"

export default async function AdminAffiliatesPage() {
  const affiliates = await getAffiliates()

  return (
    <div className="p-6">
      <p className="font-mono text-[11px] text-sage">
        {affiliates.filter((a) => !a.approvedAt).length} pending · {affiliates.filter((a) => a.approvedAt).length} approved
      </p>

      <AffiliatesManager affiliates={affiliates} />
    </div>
  )
}
