// Shared building blocks for admin loading.tsx skeletons — each page
// composes these into a shape that matches its actual content instead of
// one generic placeholder everywhere.

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-mist ${className}`} />
}

export function SkeletonBanner() {
  return <SkeletonBlock className="mb-5 h-[54px] w-full rounded-[12px]" />
}

export function SkeletonKpiGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[16px] border border-[#E4E0D6] bg-white p-4.5">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-2.5 w-20" />
            <SkeletonBlock className="h-2.5 w-8" />
          </div>
          <SkeletonBlock className="mt-3 h-6 w-24" />
          <SkeletonBlock className="mt-2 h-2.5 w-28" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[16px] border border-[#E4E0D6] bg-white p-5.5 ${className}`}>
      <SkeletonBlock className="mb-4 h-4 w-32" />
      {children}
    </div>
  )
}

export function SkeletonTableRows({ cols, rows = 5 }: { cols: string; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-white">
      <div className={`grid gap-2 bg-surface px-4 py-3`} style={{ gridTemplateColumns: cols }}>
        {cols.split(" ").map((_, i) => <SkeletonBlock key={i} className="h-2.5 w-14" />)}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`grid items-center gap-2 border-t border-border px-4 py-3.5`} style={{ gridTemplateColumns: cols }}>
          {cols.split(" ").map((_, j) => <SkeletonBlock key={j} className="h-4 w-full max-w-[80%]" />)}
        </div>
      ))}
    </div>
  )
}

export function SkeletonListCards({ count = 5, height = "h-[74px]" }: { count?: number; height?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlock key={i} className={`w-full rounded-[14px] ${height}`} />
      ))}
    </div>
  )
}

export function SkeletonKanban({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex gap-3.5 overflow-x-hidden">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="w-[266px] shrink-0">
          <SkeletonBlock className="mb-2.5 h-4 w-24" />
          <div className="flex flex-col gap-2.5 rounded-[14px] bg-[#E7E2D8] p-2.5">
            {Array.from({ length: 2 }).map((_, j) => (
              <SkeletonBlock key={j} className="h-[120px] w-full rounded-[12px] bg-white/70" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
