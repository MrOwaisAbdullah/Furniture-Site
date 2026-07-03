export default function TrackLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-mist" />
        <div className="mt-1.5 h-4 w-56 animate-pulse rounded bg-mist" />
        <div className="mt-5 flex gap-2">
          <div className="h-12 flex-1 animate-pulse rounded-[10px] bg-mist" />
          <div className="h-12 w-20 animate-pulse rounded-[10px] bg-mist" />
        </div>
        <div className="mt-8 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-mist" />
                {i < 4 && <div className="mt-1 h-10 w-0.5 animate-pulse bg-mist" />}
              </div>
              <div className="flex-1 pt-1">
                <div className="h-4 w-32 animate-pulse rounded bg-mist" />
                <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-mist" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
