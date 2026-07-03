export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="flex gap-1.5 overflow-x-auto px-5 py-4 lg:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-mist" />
        ))}
      </div>
      <div className="flex gap-6 px-5 sm:px-8 lg:px-10">
        <div className="hidden w-[230px] shrink-0 lg:block">
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 w-full animate-pulse rounded bg-mist" />
            ))}
          </div>
        </div>
        <div className="flex-1 py-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-[16px] border border-border bg-white">
                <div className="aspect-[4/3] animate-pulse bg-mist" />
                <div className="space-y-2 p-3.5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-mist" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-mist" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
