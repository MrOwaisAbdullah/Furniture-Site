import Link from "next/link"
import { XCircle, Tag } from "lucide-react"
import { getCouponPublicInfo, getAffiliateByCode } from "@/lib/neon/queries"
import { SetPromoCookie } from "./set-promo-cookie"

export const dynamic = "force-dynamic"

export default async function CouponLandingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const upperCode = code.toUpperCase()

  const coupon = await getCouponPublicInfo(upperCode)
  const affiliate = coupon ? null : await getAffiliateByCode(upperCode)

  const expired = coupon?.expiresAt ? new Date(coupon.expiresAt) < new Date() : false
  const valid = (coupon ? coupon.active && !expired : false) || (affiliate ? Boolean(affiliate.approvedAt) : false)

  const discountLabel = coupon
    ? coupon.type === "percent" ? `${coupon.value}% off` : `Rs ${coupon.value} off`
    : affiliate
      ? `Rs ${affiliate.discountForBuyer} off`
      : null

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {valid && <SetPromoCookie code={upperCode} />}

      {valid ? (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/10">
            <Tag className="h-7 w-7 text-forest" />
          </div>
          <h1 className="mt-5 font-heading font-black text-[24px] text-ink">{discountLabel}</h1>
          <p className="mt-2 text-[13.5px] text-slate">
            Code <span className="font-mono font-bold text-forest">{upperCode}</span> has been applied — it&apos;ll be
            pre-filled at checkout.
          </p>
          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Link
              href="/shop"
              className="flex min-h-[48px] items-center justify-center rounded-[12px] bg-forest font-heading font-bold text-[14px] text-bone"
            >
              Browse the shop
            </Link>
            <Link
              href="/sets"
              className="flex min-h-[48px] items-center justify-center rounded-[12px] border border-forest font-heading font-bold text-[14px] text-forest"
            >
              See bedroom sets
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
            <XCircle className="h-7 w-7 text-error" />
          </div>
          <h1 className="mt-5 font-heading font-black text-[22px] text-ink">
            {expired ? "This code has expired" : "Code not found"}
          </h1>
          <p className="mt-2 text-[13.5px] text-slate">
            {expired
              ? "This coupon is no longer valid, but you can still browse our full catalog."
              : "Double-check the code, or browse our catalog directly."}
          </p>
          <Link
            href="/shop"
            className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-[12px] bg-forest font-heading font-bold text-[14px] text-bone"
          >
            Browse the shop
          </Link>
        </>
      )}
    </div>
  )
}
