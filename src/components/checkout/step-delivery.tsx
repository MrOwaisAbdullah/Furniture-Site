"use client"

import { cn } from "@/lib/utils"
import { ADDRESS_FULL } from "@/lib/site-config"

export type DeliveryMode = "deliver" | "collect"

interface StepDeliveryProps {
  value: DeliveryMode
  onChange: (v: DeliveryMode) => void
}

const OPTIONS: { id: DeliveryMode; title: string; sub: string }[] = [
  {
    id: "deliver",
    title: "Deliver to my address",
    sub: "Karachi delivery within 3–5 days after finishing. Team calls before arrival.",
  },
  {
    id: "collect",
    title: "Collect from showroom",
    sub: `${ADDRESS_FULL}. Save on delivery.`,
  },
]

export function StepDelivery({ value, onChange }: StepDeliveryProps) {
  return (
    <div className="flex flex-col gap-3">
      {OPTIONS.map((opt) => {
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex items-start gap-3 rounded-[12px] border-2 p-4 text-left transition-colors",
              active ? "border-forest bg-white shadow-sm" : "border-border bg-white"
            )}
          >
            <div
              className={cn(
                "mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition-colors",
                active ? "border-[6px] border-forest" : "border-border-strong"
              )}
            />
            <div>
              <p className="font-heading font-bold text-[14.5px] text-ink">{opt.title}</p>
              <p className="mt-0.5 text-[12.5px] text-slate">{opt.sub}</p>
            </div>
          </button>
        )
      })}

      <div className="mt-1 rounded-[10px] bg-forest/6 px-3.5 py-3 text-[12px] text-slate leading-[1.55]">
        Delivery charge varies by area — our team will confirm on WhatsApp before you pay.
      </div>
    </div>
  )
}
