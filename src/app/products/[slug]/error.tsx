"use client"

import Link from "next/link"

export default function ProductError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-heading font-bold text-[18px] text-ink">Couldn&apos;t load product</p>
      <p className="text-[13px] text-slate">Please try again or browse our shop.</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-[10px] bg-forest px-5 py-2.5 font-heading font-bold text-[13.5px] text-bone"
        >
          Try again
        </button>
        <Link href="/shop" className="rounded-[10px] border border-border-strong px-5 py-2.5 font-heading font-bold text-[13.5px] text-slate">
          Browse shop
        </Link>
      </div>
    </div>
  )
}
