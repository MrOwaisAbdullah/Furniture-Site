import { SkeletonBlock, SkeletonTableRows } from "@/components/admin/skeleton-primitives"

export default function PayoutsLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-5 h-3 w-32" />
      <div className="grid grid-cols-3 gap-4 mb-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-[74px] rounded-[14px]" />
        ))}
      </div>
      <SkeletonTableRows cols="1.4fr 1fr 1fr 1fr 1fr 1fr" rows={4} />
    </div>
  )
}
