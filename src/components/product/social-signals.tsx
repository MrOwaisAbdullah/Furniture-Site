"use client"

import { useMemo } from "react"
import { Eye, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialSignalsProps {
  productId: string
  className?: string
}

export function SocialSignals({ productId, className }: SocialSignalsProps) {
  const { viewers, lastBooked } = useMemo(() => {
    const base = (productId.charCodeAt(productId.length - 1) % 12) + 3
    const hours = (productId.charCodeAt(0) % 18) + 2
    return {
      viewers: base,
      lastBooked: hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`,
    }
  }, [productId])

  if (!viewers) return null

  return (
    <div className={cn("flex items-center gap-2 text-[11px] font-mono", className)}>
      <Eye className="h-3 w-3 shrink-0 stroke-forest" strokeWidth={2} />
      <span className="text-forest"><span className="font-bold">{viewers}</span> viewing</span>
      {lastBooked && (
        <>
          <span className="text-border">·</span>
          <Clock className="h-3 w-3 shrink-0 stroke-gold-700" strokeWidth={2} />
          <span className="text-gold-700">Last booked <span className="font-bold">{lastBooked}</span></span>
        </>
      )}
    </div>
  )
}
