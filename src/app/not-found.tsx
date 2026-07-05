import Link from "next/link"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-display italic text-forest" style={{ fontSize: "clamp(48px,10vw,96px)" }}>
        404
      </p>
      <h1 className="mt-2 font-heading font-black text-ink" style={{ fontSize: "clamp(20px,3vw,26px)" }}>
        This piece isn&apos;t here.
      </h1>
      <p className="mt-2 max-w-sm text-[13.5px] leading-[1.6] text-slate">
        The page you&apos;re looking for may have moved or no longer exists. Let&apos;s get you back to the collection.
      </p>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <Link
          href="/"
          className="flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] bg-forest px-6 font-heading font-bold text-[14px] text-bone"
        >
          <Home className="h-4 w-4" /> Back to home
        </Link>
        <Link
          href="/shop"
          className="flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] border border-border-strong px-6 font-heading font-bold text-[14px] text-slate hover:border-forest/30 hover:text-ink transition-colors"
        >
          <Search className="h-4 w-4" /> Browse the collection
        </Link>
      </div>
    </div>
  )
}
