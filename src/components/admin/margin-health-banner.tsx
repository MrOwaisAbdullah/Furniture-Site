import { CheckCircle, AlertTriangle } from "lucide-react"

export function MarginHealthBanner({ netMarginPct, targetPct }: { netMarginPct: number; targetPct: number }) {
  const healthy = netMarginPct >= targetPct
  return (
    <div
      className="mb-5 flex items-center gap-3 rounded-[12px] border px-4.5 py-3.5"
      style={{
        background: healthy ? "rgba(62,125,106,.09)" : "rgba(184,134,47,.1)",
        borderColor: healthy ? "rgba(62,125,106,.28)" : "rgba(184,134,47,.32)",
      }}
    >
      <div
        className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full text-white"
        style={{ background: healthy ? "#3E7D6A" : "#B8862F" }}
      >
        {healthy ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      </div>
      <div className="flex-1">
        <span className="font-heading font-bold text-[13.5px]" style={{ color: healthy ? "#2c5e4f" : "#7a5f20" }}>
          {healthy ? "Margins on target." : "Online margin below target."}
        </span>
        <span className="text-[13px]" style={{ color: healthy ? "#4a7264" : "#8a6f30" }}>
          {" "}{healthy
            ? `Net margin is ${netMarginPct.toFixed(1)}% — healthy against your ${targetPct}% floor.`
            : `Review coupon discounts and affiliate commissions — net margin is ${netMarginPct.toFixed(1)}%.`}
        </span>
      </div>
      <div className="font-mono text-[11px]" style={{ color: healthy ? "#4a7264" : "#8a6f30" }}>
        Target ≥ {targetPct}%
      </div>
    </div>
  )
}
