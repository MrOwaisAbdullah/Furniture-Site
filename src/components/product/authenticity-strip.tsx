import { Hammer, ShieldCheck, Star } from "lucide-react"

const items = [
  { icon: Hammer,      label: "Karachi-made" },
  { icon: ShieldCheck, label: "5-Year Guarantee" },
  { icon: Star,        label: "4.9 on Google" },
]

export function AuthenticityStrip() {
  return (
    <div className="flex items-center gap-4 py-1">
      {items.map(({ icon: Icon, label }, i) => (
        <div key={label} className="flex items-center gap-1.5">
          {i > 0 && <div className="h-3 w-px bg-border mr-2.5" aria-hidden="true" />}
          <Icon className="h-3 w-3 shrink-0 stroke-sage" strokeWidth={1.75} />
          <span className="font-mono text-[10px] text-sage">{label}</span>
        </div>
      ))}
    </div>
  )
}
