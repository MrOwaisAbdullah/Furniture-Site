import { SkeletonBlock, SkeletonTableRows } from "@/components/admin/skeleton-primitives"

export default function ProductsLoading() {
  return (
    <div className="p-6">
      <SkeletonBlock className="mb-5 h-3 w-32" />
      <SkeletonTableRows cols="2.2fr 1.1fr 1fr 1.1fr 0.9fr 0.7fr" rows={6} />
    </div>
  )
}
