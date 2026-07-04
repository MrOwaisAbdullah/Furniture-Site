import { SkeletonBlock } from "@/components/admin/skeleton-primitives"

export default function ReportsLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-6 h-3 w-32" />
      <SkeletonBlock className="h-[180px] rounded-[14px]" />
      <SkeletonBlock className="mt-7 h-[180px] rounded-[14px]" />
      <SkeletonBlock className="mt-7 h-[240px] rounded-[14px]" />
      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-[220px] rounded-[14px]" />
        ))}
      </div>
    </div>
  )
}
