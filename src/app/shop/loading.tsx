import { Skeleton } from "@/components/ui/skeleton"

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton variant="rectangular" height={200} className="w-full" />
      <Skeleton variant="text" width="60%" height={14} />
      <Skeleton variant="text" width="40%" height={12} />
      <Skeleton variant="text" width="30%" height={14} />
    </div>
  )
}

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Skeleton variant="text" width={180} height={28} />
        <Skeleton variant="text" width={260} height={14} className="mt-2" />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
