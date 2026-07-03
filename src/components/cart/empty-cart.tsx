import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/8">
        <ShoppingBag className="h-7 w-7 stroke-forest/50" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-heading font-bold text-[18px] text-ink">Your cart is empty</p>
        <p className="mt-1.5 max-w-xs text-[13px] leading-[1.55] text-slate">
          Add pieces from the shop — your cart saves automatically while you browse.
        </p>
      </div>
      <div className="mt-2 flex gap-3">
        <Link
          href="/shop"
          className="rounded-[11px] bg-forest px-6 py-3 font-heading font-bold text-[14px] text-bone transition-transform active:scale-[.97]"
        >
          Browse shop
        </Link>
        <Link
          href="/sets"
          className="rounded-[11px] border border-border-strong px-5 py-3 font-heading font-bold text-[14px] text-slate transition-colors hover:bg-surface-sunken"
        >
          View sets
        </Link>
      </div>
    </div>
  )
}
