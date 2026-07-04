export interface BarDatum {
  label: string
  value: number
  sublabel?: string
  tone?: "default" | "success" | "error" | "gold"
}

const TONE_COLOR: Record<NonNullable<BarDatum["tone"]>, string> = {
  default: "#3E7D6A",
  success: "#3E7D6A",
  error: "#A6483B",
  gold: "#C9A24B",
}

/** Ranked horizontal bar chart for small lists (≤10 rows) — values are
 * direct-labeled on the bar itself rather than requiring a hover tooltip,
 * per the "small dataset → label directly" guidance, and colour never
 * carries meaning alone (the number is always printed too). */
export function HorizontalBarChart({
  data,
  valueFormatter = (v) => v.toLocaleString("en-US"),
  emptyMessage = "No data yet.",
}: {
  data: BarDatum[]
  valueFormatter?: (v: number) => string
  emptyMessage?: string
}) {
  if (data.length === 0) {
    return <p className="px-4 py-8 text-center font-mono text-[11px] text-sage">{emptyMessage}</p>
  }

  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="flex flex-col gap-3 p-4">
      {data.map((d) => {
        const pct = Math.max(3, (d.value / max) * 100)
        const color = TONE_COLOR[d.tone ?? "default"]
        return (
          <div key={d.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="truncate text-[12px] text-ink">{d.label}</span>
              <span className="shrink-0 font-mono text-[11px] font-bold" style={{ color }}>
                {valueFormatter(d.value)}
              </span>
            </div>
            <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#EDE8DF]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            {d.sublabel && <p className="mt-0.5 font-mono text-[9.5px] text-sage">{d.sublabel}</p>}
          </div>
        )
      })}
    </div>
  )
}
