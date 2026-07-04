import { SkeletonBlock, SkeletonTableRows } from "@/components/admin/skeleton-primitives"

export default function CouponsLoading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-6 w-28" />
        <SkeletonBlock className="h-10 w-32 rounded-[10px]" />
      </div>
      <div className="mt-5">
        <SkeletonTableRows cols="1fr 1fr 1fr 1fr 1fr 1fr" rows={4} />
      </div>
    </div>
  )
}
