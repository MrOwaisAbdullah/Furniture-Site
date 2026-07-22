"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { X, ArrowLeft } from "lucide-react"
import { slugify } from "@/lib/utils"

/** Shown when a visitor arrives at a product page from the /sets/[set]
 * bundle picker (via ?fromSet=1) so they don't lose their place mid-build. */
export function SetContextBanner({ setName }: { setName?: string }) {
  const searchParams = useSearchParams()
  const [dismissed, setDismissed] = useState(false)

  if (!setName || dismissed || searchParams.get("fromSet") !== "1") return null

  return (
    <div className="flex items-center justify-between gap-3 bg-gold/10 px-4 py-2.5 sm:px-6 lg:px-8">
      <Link
        href={`/sets/${slugify(setName)}`}
        className="flex items-center gap-1.5 font-mono text-[11.5px] font-semibold text-gold-900"
      >
        <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
        Back to the {setName} set
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="shrink-0 text-gold-900/60 transition-colors hover:text-gold-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
