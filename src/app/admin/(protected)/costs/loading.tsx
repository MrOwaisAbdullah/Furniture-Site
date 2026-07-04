import { SkeletonBlock, SkeletonTableRows } from "@/components/admin/skeleton-primitives"

export default function CostsLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-5 h-3 w-40" />
      <SkeletonBlock className="mb-4 h-10 w-64 rounded-[10px]" />
      <SkeletonTableRows cols="1.6fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 0.8fr 1fr" rows={6} />
    </div>
  )
}
