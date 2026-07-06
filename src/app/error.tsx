"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Root layout error:", error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
        <AlertTriangle className="h-6 w-6 stroke-error" />
      </div>
      <h1 className="mt-4 font-heading font-black text-[20px] text-ink">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-sm text-[13.5px] leading-[1.6] text-slate">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      {error.digest && (
        <p className="mt-3 rounded-[8px] bg-surface-sunken px-3 py-1.5 font-mono text-[10px] text-sage">
          Error ID: {error.digest}
        </p>
      )}
      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <button
          onClick={reset}
          className="flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] bg-forest px-6 font-heading font-bold text-[14px] text-bone transition-colors hover:bg-forest/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] border border-border-strong px-6 font-heading font-bold text-[14px] text-slate hover:border-forest/30 hover:text-ink transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
