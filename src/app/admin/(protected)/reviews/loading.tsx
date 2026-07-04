import { SkeletonBlock, SkeletonListCards } from "@/components/admin/skeleton-primitives"

export default function ReviewsLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-5 h-3 w-20" />
      <SkeletonListCards count={4} height="h-[110px]" />
    </div>
  )
}
