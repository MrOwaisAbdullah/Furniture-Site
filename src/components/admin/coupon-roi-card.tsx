import { formatPrice } from "@/lib/utils"

export function CouponRoiCard({ coupons }: { coupons: { code: string; discount: number; revenue: number }[] }) {
  return (
    <div className="rounded-[16px] border border-[#E4E0D6] bg-white p-5.5 shadow-[0_1px_2px_rgba(22,53,42,.04)]">
      <h3 className="mb-4.5 font-heading font-black text-[16px] text-ink">Coupon ROI</h3>
      {coupons.length === 0 ? (
        <p className="py-6 text-center font-mono text-[11px] text-sage">No coupon redemptions yet this period.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {coupons.map((c) => {
            const roi = c.discount > 0 ? c.revenue / c.discount : 0
            return (
              <div key={c.code} className="rounded-[11px] border border-[#EDE8DF] px-3.5 py-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-[6px] bg-[#F0ECE3] px-2 py-0.5 font-mono font-bold text-[12px] text-forest">{c.code}</span>
                  <span className="font-mono font-bold text-[13px] text-success">{roi.toFixed(1)}× ROI</span>
                </div>
                <div className="mt-2.5 flex justify-between text-[11px]">
                  <div>
                    <div className="text-sage">Discount given</div>
                    <div className="mt-0.5 font-mono font-bold text-error">−{formatPrice(c.discount)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sage">Revenue driven</div>
                    <div className="mt-0.5 font-mono font-bold text-forest">{formatPrice(c.revenue)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
