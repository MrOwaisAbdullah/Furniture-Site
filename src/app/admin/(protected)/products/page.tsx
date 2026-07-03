import { sampleProducts } from "@/data/sample-products"
import { formatPrice } from "@/lib/utils"

export default function AdminProductsPage() {
  return (
    <div className="p-6">
      <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
        Products
      </h1>
      <p className="mt-0.5 font-mono text-[11px] text-sage">{sampleProducts.length} items · Sample data</p>

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
