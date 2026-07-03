export default function SetsLoading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero skeleton */}
      <div className="bg-forest/6 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto h-5 w-24 animate-pulse rounded bg-mist" />
            <div className="mx-auto mt-4 h-10 w-72 animate-pulse rounded-lg bg-mist" />
            <div className="mx-auto mt-3 h-4 w-64 animate-pulse rounded bg-mist" />
          </div>
        </div>
      </div>

      {/* Tier cards skeleton */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[16px] border border-border bg-white">
              <div className="h-[140px] animate-pulse bg-mist" />
              <div className="p-5">
                <div className="h-5 w-24 animate-pulse rounded bg-mist" />
                <div className="mt-2 h-4 w-40 animate-pulse rounded bg-mist" />
                <div className="mt-4 space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3 w-full animate-pulse rounded bg-mist" />
                  ))}
                </div>
                <div className="mt-5 h-12 w-full animate-pulse rounded-[10px] bg-mist" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
