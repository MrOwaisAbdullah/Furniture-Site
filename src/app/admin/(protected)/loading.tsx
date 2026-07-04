import { SkeletonBanner, SkeletonKpiGrid, SkeletonCard } from "@/components/admin/skeleton-primitives"

export default function DashboardLoading() {
  return (
    <div className="p-6">
      <SkeletonBanner />
      <SkeletonKpiGrid />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SkeletonCard className="h-[340px]" />
        <SkeletonCard className="h-[340px]" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <SkeletonCard className="h-[220px]" />
        <SkeletonCard className="h-[220px]" />
        <SkeletonCard className="h-[220px]" />
      </div>
    </div>
  )
}
