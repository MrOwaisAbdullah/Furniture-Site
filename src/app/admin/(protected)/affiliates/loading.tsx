import { SkeletonBlock, SkeletonListCards } from "@/components/admin/skeleton-primitives"

export default function AffiliatesLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-5 h-3 w-40" />
      <SkeletonListCards count={5} height="h-[70px]" />
    </div>
  )
}
