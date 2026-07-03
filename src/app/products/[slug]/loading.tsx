export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-surface lg:flex">
      <div className="aspect-[4/3] animate-pulse bg-mist lg:aspect-auto lg:flex-[1.15]" />
      <div className="flex-1 space-y-4 p-5 lg:px-10 lg:py-8">
        <div className="h-3 w-24 animate-pulse rounded bg-mist" />
        <div className="h-7 w-3/4 animate-pulse rounded bg-mist" />
        <div className="h-6 w-1/3 animate-pulse rounded bg-mist" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-8 animate-pulse rounded-full bg-mist" />
          ))}
        </div>
        <div className="mt-6 h-12 animate-pulse rounded-[11px] bg-mist" />
      </div>
    </div>
  )
}
