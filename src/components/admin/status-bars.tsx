import { ORDER_PIPELINE } from "@/lib/order-pipeline"

const COLORS: Record<string, string> = {
  payment_pending:   "#B8862F",
  payment_confirmed: "#C9A24B",
  building:          "#5b8f7a",
  polishing:         "#3E7D6A",
  finishing:         "#2f6455",
  ready:             "#24503f",
  delivered:         "#16352A",
}

const SHORT_LABELS: Record<string, string> = {
  payment_pending:   "Pending",
  payment_confirmed: "Confirmed",
  building:          "Workshop",
  polishing:         "Polishing",
  finishing:         "Finishing",
  ready:             "Ready",
  delivered:         "Delivered",
}

export function StatusBars({ counts }: { counts: Record<string, number> }) {
  const bars = ORDER_PIPELINE.map((s) => ({ key: s.key, count: counts[s.key] ?? 0, color: COLORS[s.key] }))
  const max = Math.max(1, ...bars.map((b) => b.count))

  return (
    <div>
      <div className="flex h-[140px] items-end justify-between gap-2">
        {bars.map((b) => (
          <div key={b.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="font-mono font-bold text-[12px] text-forest">{b.count}</span>
            <div
              className="w-full max-w-[26px] rounded-t-[5px]"
              style={{ height: `${Math.max(6, (b.count / max) * 100)}%`, background: b.color }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-2">
        {bars.map((b) => (
          <span key={b.key} className="flex-1 text-center text-[8.5px] leading-tight text-sage">{SHORT_LABELS[b.key]}</span>
        ))}
      </div>
    </div>
  )
}
