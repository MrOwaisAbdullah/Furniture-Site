import Link from "next/link"
import { Heart } from "lucide-react"

export function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/8">
        <Heart className="h-7 w-7 stroke-error/60" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-heading font-bold text-[18px] text-ink">Your wishlist is empty</p>
        <p className="mt-1.5 max-w-xs text-[13px] leading-[1.55] text-slate">
          Save pieces you love — they&apos;ll wait for you here until you&apos;re ready to book.
        </p>
      </div>
      <Link
        href="/shop"
        className="mt-2 rounded-[11px] bg-forest px-6 py-3 font-heading font-bold text-[14px] text-bone transition-transform active:scale-[.97]"
      >
        Browse the shop
      </Link>
    </div>
  )
}
