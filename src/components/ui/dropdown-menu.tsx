"use client"

import { useState, useRef, useEffect, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DropdownMenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  destructive?: boolean
  disabled?: boolean
}

interface DropdownMenuProps {
  trigger: ReactNode
  items: DropdownMenuItem[]
  align?: "left" | "right"
  className?: string
}

export function DropdownMenu({ trigger, items, align = "right", className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onOutside)
    return () => document.removeEventListener("mousedown", onOutside)
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div onClick={() => setOpen((p) => !p)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
              "absolute z-40 mt-1.5 min-w-[180px] overflow-hidden rounded-[12px] border border-border bg-white py-1.5",
              align === "right" ? "right-0" : "left-0"
            )}
            style={{ boxShadow: "0 8px 30px -8px rgba(10,28,21,.22)" }}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick()
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-body text-[13px] transition-colors",
                  "min-h-[40px] cursor-pointer",
                  item.destructive
                    ? "text-error hover:bg-error/8"
                    : "text-ink hover:bg-surface-sunken",
                  item.disabled && "opacity-40 cursor-not-allowed"
                )}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
