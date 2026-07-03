"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ThemedSelectProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  className?: string
  label?: string
}

export function ThemedSelect({ value, onChange, options, placeholder = "Select...", className, label }: ThemedSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open])

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <p className="mb-1.5 font-body font-semibold text-[12.5px] text-slate">{label}</p>
      )}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{ touchAction: "manipulation" }}
        className={cn(
          "flex w-full items-center justify-between rounded-[10px] border bg-white px-3.5 py-3.5 text-[13.5px] transition-colors",
          open
            ? "border-forest outline-none ring-2 ring-forest/15"
            : "border-border-strong hover:border-forest/40",
          current ? "text-ink" : "text-sage/60"
        )}
      >
        <span>{current?.label ?? placeholder}</span>
        <ChevronDown
          className={cn("ml-2 h-4 w-4 shrink-0 text-sage transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute inset-x-0 top-full z-30 mt-1.5 overflow-hidden rounded-[12px] border border-border bg-white"
            style={{ boxShadow: "0 8px 30px -8px rgba(10,28,21,.2)" }}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="max-h-[220px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-3 text-left font-body text-[13px] transition-colors",
                    opt.value === value
                      ? "bg-forest font-semibold text-bone"
                      : "text-ink hover:bg-surface-sunken"
                  )}
                >
                  {opt.label}
                  {opt.value === value && (
                    <Check className="h-3.5 w-3.5 shrink-0 stroke-gold" strokeWidth={2.5} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
