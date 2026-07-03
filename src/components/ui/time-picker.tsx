"use client"

import { useState, useRef, useEffect } from "react"
import { Clock, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string // "HH:MM" 24-hour format
  onChange?: (time: string) => void
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
  placeholder?: string
  minuteStep?: number
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function parseTime(value?: string): { hour12: number; minute: number; period: "AM" | "PM" } {
  if (!value) return { hour12: 9, minute: 0, period: "AM" }
  const parts = value.split(":")
  const h = Number(parts[0]) || 0
  const m = Number(parts[1]) || 0
  const period = h >= 12 ? "PM" : "AM"
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return { hour12, minute: m, period }
}

function to24Hour(hour12: number, minute: number, period: "AM" | "PM"): string {
  let h = hour12
  if (period === "PM" && hour12 !== 12) h = hour12 + 12
  if (period === "AM" && hour12 === 12) h = 0
  return `${pad(h)}:${pad(minute)}`
}

function ScrollColumn({
  items,
  selected,
  onSelect,
  label,
}: {
  items: (string | number)[]
  selected: string | number
  onSelect: (v: string | number) => void
  label: string
}) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current) return
    const idx = items.indexOf(selected)
    if (idx === -1) return
    const itemH = 40
    const containerH = listRef.current.clientHeight
    listRef.current.scrollTop = idx * itemH - containerH / 2 + itemH / 2
  }, [selected, items])

  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 font-mono text-[9px] uppercase tracking-[1.5px] text-sage">{label}</p>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            const idx = items.indexOf(selected)
            if (idx > 0 && items[idx - 1] !== undefined) onSelect(items[idx - 1]!)
          }}
          aria-label="Previous"
          className="flex h-8 w-full items-center justify-center text-sage hover:text-ink transition-colors cursor-pointer"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        <div
          ref={listRef}
          className="h-[120px] w-[60px] overflow-y-auto snap-y snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                "flex h-[40px] w-full items-center justify-center snap-center font-mono text-[15px] transition-colors cursor-pointer",
                item === selected
                  ? "bg-forest text-bone font-bold rounded-lg"
                  : "text-ink hover:bg-surface-sunken rounded-lg"
              )}
            >
              {typeof item === "number" ? pad(item) : item}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const idx = items.indexOf(selected)
            if (idx < items.length - 1 && items[idx + 1] !== undefined) onSelect(items[idx + 1]!)
          }}
          aria-label="Next"
          className="flex h-8 w-full items-center justify-center text-sage hover:text-ink transition-colors cursor-pointer"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function TimePicker({
  value,
  onChange,
  label,
  error,
  hint,
  disabled = false,
  placeholder = "Select time",
  minuteStep = 15,
}: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const parsed = parseTime(value)

  const [selHour, setSelHour] = useState(parsed.hour12)
  const [selMinute, setSelMinute] = useState(parsed.minute)
  const [selPeriod, setSelPeriod] = useState<"AM" | "PM">(parsed.period)

  // Reset selection when opening
  const handleOpen = () => {
    const t = parseTime(value)
    setSelHour(t.hour12)
    setSelMinute(t.minute)
    setSelPeriod(t.period)
    setOpen(true)
  }

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open])

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep)

  const commit = (h: number, m: number, p: "AM" | "PM") => {
    onChange?.(to24Hour(h, m, p))
  }

  const display = value || ""
  const hasError = !!error

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">{label}</label>
      )}
      <button
        type="button"
        onClick={() => !disabled && (open ? setOpen(false) : handleOpen())}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between rounded-[10px] border bg-white px-3.5 py-3.5 text-[13.5px] transition-colors",
          "min-h-[44px] cursor-pointer",
          open ? "border-forest outline-none ring-2 ring-forest/15" : "border-border-strong hover:border-forest/40",
          hasError && "border-error focus:ring-error",
          disabled && "opacity-50 cursor-not-allowed bg-surface-sunken",
          display ? "text-ink" : "text-sage/60"
        )}
      >
        <span className="font-mono">{display || placeholder}</span>
        <Clock className="ml-2 h-4 w-4 shrink-0 text-sage" />
      </button>

      {open && (
        <div
          className="absolute inset-x-0 top-full z-30 mt-1.5 rounded-[14px] border border-border bg-white p-4"
          style={{ boxShadow: "0 12px 40px -12px rgba(10,28,21,.25)" }}
        >
          <div className="flex items-start justify-center gap-2">
            <ScrollColumn
              items={hours}
              selected={selHour}
              onSelect={(h) => {
                setSelHour(h as number)
                commit(h as number, selMinute, selPeriod)
              }}
              label="Hour"
            />
            <span className="mt-8 font-mono text-[20px] font-bold text-ink">:</span>
            <ScrollColumn
              items={minutes}
              selected={selMinute}
              onSelect={(m) => {
                setSelMinute(m as number)
                commit(selHour, m as number, selPeriod)
              }}
              label="Min"
            />
            <div className="flex flex-col gap-1">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[1.5px] text-sage">&nbsp;</p>
              {(["AM", "PM"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setSelPeriod(p)
                    commit(selHour, selMinute, p)
                  }}
                  className={cn(
                    "h-[56px] w-[48px] rounded-lg font-mono text-[13px] font-bold transition-colors cursor-pointer",
                    selPeriod === p
                      ? "bg-forest text-bone"
                      : "bg-surface-sunken text-slate hover:bg-border"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex justify-end border-t border-border pt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-[8px] bg-forest px-4 py-2 font-heading font-bold text-[12px] text-bone transition-colors hover:bg-forest/90 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {hint && !hasError && <p className="mt-1 text-[11px] text-sage">{hint}</p>}
      {hasError && <p className="mt-1 text-[11px] text-error">{error}</p>}
    </div>
  )
}
