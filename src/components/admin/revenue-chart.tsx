export interface WeekPoint {
  week: string
  online: number
  showroom: number
}

export function RevenueChart({ weeks }: { weeks: WeekPoint[] }) {
  if (weeks.length === 0) {
    return <p className="py-10 text-center font-mono text-[11px] text-sage">No revenue data yet this period.</p>
  }

  const CW = 580, CH = 190, X0 = 34
  const maxV = Math.max(1, ...weeks.map((w) => Math.max(w.online, w.showroom))) * 1.15
  const n = weeks.length
  const px = (i: number) => (n === 1 ? X0 : X0 + (i * (CW - X0)) / (n - 1))
  const py = (v: number) => CH - (v / maxV) * (CH - 15)
  const ptsOf = (arr: number[]) => arr.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(" ")
  const areaOf = (arr: number[]) => `${X0},${CH} ${ptsOf(arr)} ${CW},${CH}`

  const online = weeks.map((w) => w.online)
  const showroom = weeks.map((w) => w.showroom)
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => maxV * f)

  return (
    <svg viewBox={`0 0 ${CW} ${CH + 20}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
      {gridLines.map((v, i) => (
        <g key={i}>
          <line x1={X0} y1={py(v)} x2={CW} y2={py(v)} stroke="#EDE8DF" strokeWidth={1} />
          <text x={X0 - 6} y={py(v) + 3} textAnchor="end" fontFamily="Space Mono, monospace" fontSize={9} fill="#B7AE9E">
            {(v / 1000).toFixed(0)}k
          </text>
        </g>
      ))}
      <polygon points={areaOf(showroom)} fill="rgba(201,162,75,.12)" />
      <polygon points={areaOf(online)} fill="rgba(62,125,106,.12)" />
      <polyline points={ptsOf(showroom)} fill="none" stroke="#C9A24B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={ptsOf(online)} fill="none" stroke="#3E7D6A" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {weeks.map((w, i) => (
        <text key={w.week} x={px(i)} y={CH + 14} textAnchor="middle" fontFamily="Space Mono, monospace" fontSize={9} fill="#B7AE9E">
          {new Date(w.week).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </text>
      ))}
    </svg>
  )
}
