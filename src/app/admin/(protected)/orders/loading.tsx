import { SkeletonBlock, SkeletonKanban } from "@/components/admin/skeleton-primitives"

export default function OrdersLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-10 w-40 rounded-[10px]" />
      </div>
      <div className="mt-5">
        <SkeletonBlock className="mb-4 h-10 w-48 rounded-[10px]" />
        <SkeletonKanban columns={7} />
      </div>
    </div>
  )
}
