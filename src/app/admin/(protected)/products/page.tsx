import Image from "next/image"
import Link from "next/link"
import { PenSquare } from "lucide-react"
import { getProducts } from "@/lib/sanity/queries"
import { formatPrice } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] text-sage">{products.length} products · live from Sanity</p>
        <Link
          href="/admin/content-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[40px] items-center gap-1.5 rounded-[10px] bg-forest px-3.5 font-heading font-bold text-[12.5px] text-bone"
        >
          <PenSquare className="h-4 w-4" /> Add / edit products
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[14px] border border-border bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-sunken">
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[1px] text-sage">Product</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[1px] text-sage">SKU</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[1px] text-sage">Finishes</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[1px] text-sage">Price</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[1px] text-sage">Stock</th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[1px] text-sage">Lead time</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[8px] bg-mist">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-[13.5px] text-ink truncate">{p.name}</p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-sage">{p.category.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[11.5px] text-slate">{p.sku || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {p.finishes.length === 0 ? (
                      <span className="font-mono text-[11px] text-mist">—</span>
                    ) : (
                      p.finishes.map((f) => (
                        <span
                          key={f._id}
                          title={f.name}
                          className="h-4 w-4 shrink-0 rounded-full border border-black/10"
                          style={{ background: f.colorCode }}
                        />
                      ))
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <p className="font-mono text-[13px] text-gold-700">{formatPrice(p.salePrice ?? p.basePrice)}</p>
                  {p.salePrice && (
                    <p className="font-mono text-[10.5px] text-sage line-through">{formatPrice(p.basePrice)}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <p className={`font-mono text-[11.5px] font-semibold ${p.inStock ? "text-success" : "text-error"}`}>
                    {p.inStock ? `${p.stockCount} in stock` : "Out of stock"}
                  </p>
                </td>
                <td className="px-4 py-3 text-right font-mono text-[11px] text-sage">
                  {p.inStock ? "2-week delivery" : "12–18 days"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
