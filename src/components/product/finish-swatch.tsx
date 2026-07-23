"use client"

import { cn } from "@/lib/utils"
import type { Finish } from "@/types"

interface FinishSwatchProps {
  finishes: Finish[]
  selected: number
  onSelect: (index: number) => void
  className?: string
}

export function FinishSwatch({ finishes, selected, onSelect, className }: FinishSwatchProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {finishes.map((finish, i) => (
        <button
          key={finish._id}
          onClick={() => onSelect(i)}
          aria-label={`Select finish: ${finish.name}`}
          aria-pressed={selected === i}
          className={cn(
            "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
            selected === i
              ? "scale-110 ring-2 ring-forest ring-offset-2"
              : "ring-1 ring-border hover:scale-105 hover:ring-forest/40"
          )}
        >
          <span
            className="h-7 w-7 rounded-full block shadow-sm"
            style={{ background: finish.colorCode }}
          />
          {/* Tooltip */}
          <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[9px] text-bone opacity-0 transition-opacity group-hover:opacity-100">
            {finish.name}
          </span>
        </button>
      ))}
    </div>
  )
}
