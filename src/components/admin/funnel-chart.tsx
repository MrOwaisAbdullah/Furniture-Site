export interface FunnelStage {
  stage: string
  count: number
  dropOffPct: number | null
}

/** Stepped funnel — each stage is a centered bar scaled to the first
 * stage's count, with the drop-off % printed between stages (not colour
 * alone) so screen readers and colorblind users get the same signal. */
export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  if (stages.every((s) => s.count === 0)) {
    return <p className="px-4 py-8 text-center font-mono text-[11px] text-sage">No tracked activity yet this period.</p>
  }

  const max = Math.max(1, stages[0]?.count ?? 1)

  return (
    <div className="flex flex-col gap-0 p-4">
      {stages.map((s, i) => {
        const pct = Math.max(6, (s.count / max) * 100)
        return (
          <div key={s.stage}>
            <div className="flex items-center gap-3">
              <div className="mx-auto w-full">
                <div
                  className="mx-auto flex h-[42px] items-center justify-center rounded-[8px] font-mono text-[13px] font-bold text-bone"
                  style={{
                    width: `${pct}%`,
                    background: i === stages.length - 1 ? "#3E7D6A" : "#16352A",
                  }}
                >
                  {s.count.toLocaleString("en-US")}
                </div>
              </div>
            </div>
            <p className="mt-1.5 text-center text-[11px] text-slate">{s.stage}</p>
            {i < stages.length - 1 && (
              <div className="my-1.5 flex items-center justify-center gap-1.5">
                <div className="h-3 w-px bg-border-strong" />
                {s.dropOffPct !== null && s.dropOffPct !== undefined && (
                  <span className={`font-mono text-[10px] ${stages[i + 1].dropOffPct! > 50 ? "text-error" : "text-sage"}`}>
                    {stages[i + 1].dropOffPct}% drop-off
                  </span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
