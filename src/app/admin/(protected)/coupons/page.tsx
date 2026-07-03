import { getCoupons } from "@/lib/neon/queries"
import { CouponsManager } from "@/components/admin/coupons-manager"

export const dynamic = "force-dynamic"

export default async function AdminCouponsPage() {
  const coupons = await getCoupons()

  return (
    <div className="p-6">
      <CouponsManager coupons={coupons} />
    </div>
  )
}
