import Link from "next/link"
import { sampleProducts } from "@/data/sample-products"
import { formatPrice } from "@/lib/utils"

const sharedItems = sampleProducts.slice(0, 3)

export default async function SharedWishlistPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return (
    <div className="min-h-screen bg-surface">
      <div
        className="px-5 pb-8 pt-8 text-bone sm:px-8"
        style={{ background: "linear-gradient(145deg,#1c4233,#0a1c15)" }}
      >
        <p
          className="font-mono uppercase text-gold"
          style={{ fontSize: "10px", letterSpacing: "3px" }}
        >
          Shared wishlist
        </p>
        <h1
          className="mt-3 font-display italic leading-tight text-bone"
          style={{ fontSize: "clamp(22px,5vw,34px)" }}
        >
          Someone shared a list with you.
        </h1>
        <p className="mt-2 font-mono text-[10px] text-bone/40">Token: {token}</p>
      </div>

      <div className="mx-auto max-w-xl px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-3">
          {sharedItems.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="flex gap-4 rounded-[14px] border border-border bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <div
                className="h-16 w-16 shrink-0 rounded-[10px]"
                style={{ background: "linear-gradient(150deg,#e8e0d0,#d4caba)" }}
              />
              <div className="flex-1">
                <p className="font-heading font-bold text-[14px] text-ink">{product.name}</p>
                <p className="mt-0.5 font-mono text-[12.5px] text-gold-700">{formatPrice(product.basePrice)}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5A50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>

        <Link
          href="/shop"
          className="mt-6 flex items-center justify-center rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[14.5px] text-bone"
        >
          Browse our shop
        </Link>
      </div>
    </div>
  )
}
