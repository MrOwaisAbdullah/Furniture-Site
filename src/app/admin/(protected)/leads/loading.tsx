import { SkeletonBlock, SkeletonListCards } from "@/components/admin/skeleton-primitives"

export default function LeadsLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-5 h-3 w-24" />
      <SkeletonListCards count={6} height="h-[86px]" />
    </div>
  )
}
