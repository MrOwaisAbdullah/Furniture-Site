import { SkeletonBlock } from "@/components/admin/skeleton-primitives"

export default function PopupsLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-6 h-3 w-32" />
      <SkeletonBlock className="h-[220px] rounded-[14px]" />
      <SkeletonBlock className="mt-7 h-[220px] rounded-[14px]" />
    </div>
  )
}
