import { CheckCircle, MessageCircle } from "lucide-react"

export function StepConfirm() {
  return (
    <div className="flex flex-col gap-4">
      {/* What happens next */}
      <div className="rounded-[13px] border border-border bg-white p-4">
        <p className="mb-3 font-heading font-bold text-[14px] text-ink">What happens next</p>
        <div className="flex flex-col gap-3">
          {[
            { icon: CheckCircle, text: "We verify your advance payment within 2 hours" },
            { icon: MessageCircle, text: "Our team WhatsApps you to confirm your build slot" },
            { icon: CheckCircle, text: "Workshop begins — you get updates at every stage" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest/8">
                <Icon className="h-3.5 w-3.5 stroke-forest" strokeWidth={2} />
              </div>
              <p className="text-[12.5px] leading-[1.55] text-slate">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
