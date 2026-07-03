"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  label?: string
  error?: string
  hint?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  placeholder?: string
  minuteStep?: number
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function formatDisplay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function ScrollColumn({
  items,
  selected,
  onSelect,
}: {
  items: (string | number)[]
  selected: string | number
  onSelect: (v: string | number) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!listRef.current) return
    const idx = items.indexOf(selected)
    if (idx === -1) return
    const itemH = 36
    const containerH = listRef.current.clientHeight
    listRef.current.scrollTop = idx * itemH - containerH / 2 + itemH / 2
  }, [selected, items])

  return (
    <div
      ref={listRef}
      className="h-[108px] w-[52px] overflow-y-auto snap-y snap-mandatory rounded-lg bg-surface-sunken"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className={cn(
            "flex h-[36px] w-full items-center justify-center snap-center font-mono text-[13px] transition-colors cursor-pointer",
            item === selected
              ? "bg-forest text-bone font-bold"
              : "text-ink hover:bg-border"
          )}
        >
          {typeof item === "number" ? pad(item) : item}
        </button>
      ))}
    </div>
  )
}

export function DateTimePicker({
  value,
  onChange,
  label,
  error,
  hint,
  minDate,
  maxDate,
  disabled = false,
  placeholder = "Select date & time",
  minuteStep = 15,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewDate, setViewDate] = useState(value || new Date())

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const selectedDate = value ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : null
  const hour24 = value ? value.getHours() : 9
  const minute = value ? value.getMinutes() : 0
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM"
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24

  const [selHour, setSelHour] = useState(hour12)
  const [selMinute, setSelMinute] = useState(minute)
  const [selPeriod, setSelPeriod] = useState<"AM" | "PM">(period)

  // Reset selection when opening
  const handleOpen = () => {
    if (value) {
      setSelHour(value.getHours() === 0 ? 12 : value.getHours() > 12 ? value.getHours() - 12 : value.getHours())
      setSelMinute(value.getMinutes())
      setSelPeriod(value.getHours() >= 12 ? "PM" : "AM")
    }
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

  const commitDateTime = (d: Date, h: number, m: number, p: "AM" | "PM") => {
    const h24 = p === "PM" && h !== 12 ? h + 12 : p === "AM" && h === 12 ? 0 : h
    const result = new Date(d)
    result.setHours(h24, m, 0, 0)
    onChange?.(result)
  }

  const isDayDisabled = (day: number) => {
    const d = new Date(year, month, day)
    d.setHours(0, 0, 0, 0)
    if (minDate && d < minDate) return true
    if (maxDate && d > maxDate) return true
    return false
  }

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
          hasError && "border-error",
          disabled && "opacity-50 cursor-not-allowed bg-surface-sunken",
          value ? "text-ink" : "text-sage/60"
        )}
      >
        <span>{value ? formatDisplay(value) : placeholder}</span>
        <Calendar className="ml-2 h-4 w-4 shrink-0 text-sage" />
      </button>

      {open && (
        <div
          className="absolute inset-x-0 top-full z-30 mt-1.5 rounded-[14px] border border-border bg-white p-4"
          style={{ boxShadow: "0 12px 40px -12px rgba(10,28,21,.25)" }}
        >
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1))}
              aria-label="Previous month"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-heading font-bold text-[14px] text-ink">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1))}
              aria-label="Next month"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center font-mono text-[10px] text-sage py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const d = new Date(year, month, day)
              d.setHours(0, 0, 0, 0)
              const isSelected = selectedDate?.getTime() === d.getTime()
              const isToday = today.getTime() === d.getTime()
              const disabled = isDayDisabled(day)

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (disabled) return
                    const base = new Date(year, month, day)
                    commitDateTime(base, selHour, selMinute, selPeriod)
                  }}
                  disabled={disabled}
                  className={cn(
                    "flex h-9 w-full items-center justify-center rounded-lg font-mono text-[12px] transition-colors cursor-pointer",
                    isSelected && "bg-forest text-bone font-bold",
                    !isSelected && isToday && "border border-gold text-forest font-bold",
                    !isSelected && !isToday && !disabled && "hover:bg-surface-sunken text-ink",
                    disabled && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Time section */}
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-3.5 w-3.5 text-sage" />
              <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-sage">Time</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ScrollColumn
                items={hours}
                selected={selHour}
                onSelect={(h) => {
                  setSelHour(h as number)
                  if (value) commitDateTime(value, h as number, selMinute, selPeriod)
                }}
              />
              <span className="mt-4 font-mono text-[18px] font-bold text-ink">:</span>
              <ScrollColumn
                items={minutes}
                selected={selMinute}
                onSelect={(m) => {
                  setSelMinute(m as number)
                  if (value) commitDateTime(value, selHour, m as number, selPeriod)
                }}
              />
              <div className="flex flex-col gap-1 mt-4">
                {(["AM", "PM"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSelPeriod(p)
                      if (value) commitDateTime(value, selHour, selMinute, p)
                    }}
                    className={cn(
                      "h-[50px] w-[44px] rounded-lg font-mono text-[12px] font-bold transition-colors cursor-pointer",
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
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <button
              type="button"
              onClick={() => { onChange?.(null); setOpen(false) }}
              className="rounded-[8px] px-3 py-2 font-heading font-bold text-[12px] text-slate hover:bg-surface-sunken transition-colors cursor-pointer"
            >
              Clear
            </button>
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
