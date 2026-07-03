export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="px-5 py-8 sm:px-8">
        <div className="h-3 w-24 animate-pulse rounded bg-mist" />
        <div className="mt-3 h-8 w-64 animate-pulse rounded bg-mist" />
      </div>
      <div className="mx-auto max-w-5xl px-5 pb-12 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[16px] border border-border bg-white">
              <div className="h-[160px] animate-pulse bg-mist sm:h-[200px]" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-mist" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-mist" />
                <div className="h-4 w-full animate-pulse rounded bg-mist" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-mist" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
