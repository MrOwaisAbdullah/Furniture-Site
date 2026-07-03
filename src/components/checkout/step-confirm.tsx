import { CheckCircle, MessageCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  finishName?: string
}

interface StepConfirmProps {
  items: OrderItem[]
  totalPrice: number
  advance: number
}

export function StepConfirm({ items, totalPrice, advance }: StepConfirmProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Order summary card */}
      <div className="overflow-hidden rounded-[13px] border border-border bg-white">
        <div className="bg-surface-sunken px-4 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-[1.5px] text-sage">Order summary</p>
        </div>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.productId} className="flex items-start justify-between px-4 py-3">
              <div className="flex-1 min-w-0 pr-2">
                <p className="font-heading font-bold text-[13px] text-ink leading-[1.2] truncate">{item.name}</p>
                {item.finishName && (
                  <p className="mt-0.5 text-[11px] text-sage">{item.finishName}</p>
                )}
                <p className="mt-0.5 font-mono text-[10.5px] text-sage">×{item.quantity}</p>
              </div>
              <p className="font-mono text-[13px] font-semibold text-ink shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-baseline justify-between border-t border-border px-4 py-3">
          <span className="font-heading font-bold text-[13px] text-ink">Total</span>
          <span className="font-mono font-bold text-[16px] text-forest">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* Advance block */}
      <div
        className="flex items-center justify-between rounded-[13px] px-4 py-4"
        style={{ background: "linear-gradient(150deg,#16352A,#0c231b)" }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[1.5px] text-bone/60">
            30–50% advance to confirm
          </p>
          <p className="mt-0.5 text-[11.5px] text-bone/55">Balance paid on delivery</p>
        </div>
        <p className="font-mono font-bold text-[26px] text-gold">{formatPrice(advance)}</p>
      </div>

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

      <div className="rounded-[10px] bg-gold/10 px-3.5 py-3">
        <p className="text-[11.5px] leading-[1.55] text-gold-900">
          By confirming, you agree to our <strong>advance payment policy</strong>. Cancellations must be requested before the build begins.
        </p>
      </div>
    </div>
  )
}
