export default function HomePageLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-forest" style={{ minHeight: 580 }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-14">
          <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:min-h-[580px]">
            <div className="flex flex-1 flex-col justify-center py-12 sm:py-14 lg:py-16 lg:pr-14">
              <div className="h-3 w-32 rounded bg-bone/20" />
              <div className="mt-4 h-12 w-64 rounded bg-bone/20" />
              <div className="mt-2 h-12 w-48 rounded bg-gold/30" />
              <div className="mt-5 h-4 w-72 rounded bg-bone/15" />
              <div className="mt-8 flex gap-3">
                <div className="h-12 w-36 rounded-[10px] bg-gold/40" />
                <div className="h-12 w-32 rounded-[10px] bg-bone/15" />
              </div>
            </div>
            <div className="hidden lg:flex lg:w-[48%] lg:shrink-0 lg:items-center lg:py-8">
              <div className="h-[500px] w-full rounded-2xl bg-bone/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar skeleton */}
      <div className="border-b border-border bg-white">
        <div className="flex items-center justify-center gap-8 px-5 py-3 sm:px-8 lg:px-14">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="h-[30px] w-[30px] rounded-full bg-gold/15" />
              <div className="h-3 w-20 rounded bg-slate/20" />
            </div>
          ))}
        </div>
      </div>

      {/* Featured sets skeleton */}
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-10 sm:px-6 lg:px-14">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="h-2.5 w-16 rounded bg-gold/30" />
            <div className="mt-1.5 h-5 w-32 rounded bg-ink/15" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="aspect-[4/3] bg-slate/10" />
              <div className="p-4">
                <div className="h-2 w-12 rounded bg-gold/30" />
                <div className="mt-2 h-4 w-28 rounded bg-ink/15" />
                <div className="mt-3 h-4 w-20 rounded bg-forest/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
