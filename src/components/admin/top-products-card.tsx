import { formatPrice } from "@/lib/utils"

export function TopProductsCard({ products }: { products: { name: string; revenue: number }[] }) {
  const max = Math.max(1, ...products.map((p) => p.revenue))

  return (
    <div className="rounded-[16px] border border-[#E4E0D6] bg-white p-5.5 shadow-[0_1px_2px_rgba(22,53,42,.04)]">
      <h3 className="mb-4.5 font-heading font-black text-[16px] text-ink">Top products · revenue</h3>
      {products.length === 0 ? (
        <p className="py-6 text-center font-mono text-[11px] text-sage">No orders yet this period.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {products.map((p, i) => (
            <div key={p.name}>
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-sage">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[12.5px] font-semibold text-ink">{p.name}</span>
                </div>
                <span className="font-mono font-bold text-[12px] text-forest">{formatPrice(p.revenue)}</span>
              </div>
              <div className="h-[7px] overflow-hidden rounded-full bg-[#F0ECE3]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(p.revenue / max) * 100}%`, background: "linear-gradient(90deg,#3E7D6A,#16352A)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
