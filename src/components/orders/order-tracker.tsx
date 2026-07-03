import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type StepStatus = "done" | "active" | "upcoming"

export interface OrderStep {
  label: string
  time?: string
  note?: string
  status: StepStatus
}

interface OrderTrackerProps {
  steps: OrderStep[]
  orderRef: string
}

export function OrderTracker({ steps, orderRef }: OrderTrackerProps) {
  return (
    <div>
      <div className="mb-5 rounded-[13px] border border-border bg-white px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[1.5px] text-sage">Order ref</p>
        <p className="mt-1 font-mono font-bold text-[16px] text-forest">{orderRef}</p>
      </div>

      <div className="flex flex-col">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1
          return (
            <div key={step.label} className="flex gap-4">
              {/* Timeline track */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                    step.status === "done"
                      ? "border-forest bg-forest shadow-[0_0_0_3px_rgba(22,53,42,.12)]"
                      : step.status === "active"
                      ? "border-gold bg-gold shadow-[0_0_0_3px_rgba(201,162,75,.15)] animate-pulse"
                      : "border-border bg-surface"
                  )}
                >
                  {step.status === "done" && (
                    <Check className="h-3.5 w-3.5 stroke-gold" strokeWidth={3} />
                  )}
                  {step.status === "active" && (
                    <div className="h-2 w-2 rounded-full bg-forest" />
                  )}
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 transition-colors",
                      step.status === "done" ? "bg-forest/40" : "bg-border"
                    )}
                    style={{ minHeight: 32 }}
                  />
                )}
              </div>

              {/* Step content */}
              <div className={cn("pb-6 pt-0.5", isLast && "pb-0")}>
                <p
                  className={cn(
                    "font-heading font-bold text-[14.5px]",
                    step.status === "upcoming" ? "text-sage" : "text-ink"
                  )}
                >
                  {step.label}
                </p>
                {step.time && (
                  <p className="mt-0.5 font-mono text-[10.5px] text-sage">{step.time}</p>
                )}
                {step.note && (
                  <p className="mt-1.5 max-w-sm text-[12.5px] leading-[1.5] text-slate">{step.note}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
