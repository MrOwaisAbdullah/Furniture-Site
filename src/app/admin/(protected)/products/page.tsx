import Link from "next/link"
import { PenSquare } from "lucide-react"
import { sampleProducts } from "@/data/sample-products"
import { formatPrice } from "@/lib/utils"

export default function AdminProductsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-sage">{sampleProducts.length} items · Sample data</p>
        <Link
          href="/admin/content-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-forest px-3.5 font-heading font-bold text-[12.5px] text-bone"
        >
          <PenSquare className="h-4 w-4" /> Add / edit products
        </Link>
      </div>
      <p className="mt-2 rounded-[10px] bg-info/8 px-3 py-2 text-[11.5px] text-info">
        Add or edit products in Content Studio — it opens in a new tab. Note: the live site still reads from
        this sample catalog, not Studio yet, so changes there won&apos;t appear on the storefront until that
        wiring is done.
      </p>

      <div className="mt-5 overflow-hidden rounded-[14px] border border-border bg-white">
        {sampleProducts.map((p, i) => (
          <div
            key={p._id}
            className={`flex items-center gap-4 px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <div className="h-10 w-10 shrink-0 rounded-[8px] bg-mist" />
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-[13.5px] text-ink truncate">{p.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-sage">{p.sku}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[13px] text-gold-700">{formatPrice(p.basePrice)}</p>
              <p className={`font-mono text-[10px] ${p.inStock ? "text-success" : "text-error"}`}>
                {p.inStock ? `${p.stockCount} in stock` : "Out of stock"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
