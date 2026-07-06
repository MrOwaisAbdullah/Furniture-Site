"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
        <AlertTriangle className="h-6 w-6 stroke-error" />
      </div>
      <div>
        <p className="font-heading font-bold text-[18px] text-ink">Couldn&apos;t load this category</p>
        <p className="mt-1 text-[13px] text-slate">Something went wrong while loading this category.</p>
      </div>
      {error.digest && (
        <p className="rounded-[8px] bg-surface-sunken px-3 py-1.5 font-mono text-[10px] text-sage">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-[10px] bg-forest px-5 py-2.5 font-heading font-bold text-[13.5px] text-bone transition-colors hover:bg-forest/90"
        >
          Try again
        </button>
        <Link
          href="/shop"
          className="rounded-[10px] border border-border-strong px-5 py-2.5 font-heading font-bold text-[13.5px] text-slate hover:border-forest/30 hover:text-ink transition-colors"
        >
          View all furniture
        </Link>
      </div>
    </div>
  )
}
