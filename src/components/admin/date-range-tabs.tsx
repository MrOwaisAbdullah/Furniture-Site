"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { key: "this_month", label: "This month" },
  { key: "last_month", label: "Last month" },
]

export function DateRangeTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const active = searchParams.get("range") ?? "this_month"

  return (
    <div className="flex gap-1 rounded-[10px] border border-border bg-white p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => router.push(`/admin?range=${opt.key}`)}
          className={cn(
            "rounded-[7px] px-3 py-1.5 text-[12px] font-medium transition-colors",
            active === opt.key ? "bg-forest text-bone" : "text-slate hover:bg-surface"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
