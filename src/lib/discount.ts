import { validateCoupon, validateAffiliate } from "@/lib/neon/queries"

export type ResolvedDiscount =
  | { discount: number; type: null }
  | { discount: number; type: "coupon"; couponId: number; code: string; ignoredAffiliateCode?: string }
  | { discount: number; type: "affiliate"; affiliateId: number; commissionPct: number; code: string; ignoredCouponCode?: string }

/**
 * Only one discount applies per order — unless the coupon has combinable:
 * true (an explicit opt-in the admin sets per coupon). Otherwise the higher
 * value wins and the other code is logged as ignored, never stacked.
 */
export async function resolveDiscount(
  couponCode: string | undefined,
  affiliateCode: string | undefined,
  orderValue: number,
  customerPhone?: string
): Promise<ResolvedDiscount> {
  const couponResult = couponCode ? await validateCoupon(couponCode, orderValue, customerPhone) : null
  const affiliateResult = affiliateCode ? await validateAffiliate(affiliateCode) : null

  const coupon = couponResult?.valid ? couponResult : null
  const affiliate = affiliateResult?.valid ? affiliateResult : null

  if (!coupon && !affiliate) {
    return { discount: 0, type: null }
  }

  if (coupon && !affiliate) {
    return { discount: coupon.discountAmt!, type: "coupon", couponId: coupon.coupon!.id, code: couponCode!.toUpperCase() }
  }

  if (!coupon && affiliate) {
    return {
      discount: affiliate.discountForBuyer,
      type: "affiliate",
      affiliateId: affiliate.affiliate.id,
      commissionPct: Number(affiliate.affiliate.commissionPct),
      code: affiliateCode!.toUpperCase(),
    }
  }

  // Both present. Combinable coupons are the opt-in exception — apply both
  // and treat it as a coupon-type discount for redemption bookkeeping, with
  // the affiliate still credited for commission.
  if (coupon!.coupon!.combinable) {
    return {
      discount: coupon!.discountAmt! + affiliate!.discountForBuyer,
      type: "coupon",
      couponId: coupon!.coupon!.id,
      code: couponCode!.toUpperCase(),
    }
  }

  if (coupon!.discountAmt! >= affiliate!.discountForBuyer) {
    return {
      discount: coupon!.discountAmt!,
      type: "coupon",
      couponId: coupon!.coupon!.id,
      code: couponCode!.toUpperCase(),
      ignoredAffiliateCode: affiliateCode,
    }
  }

  return {
    discount: affiliate!.discountForBuyer,
    type: "affiliate",
    affiliateId: affiliate!.affiliate.id,
    commissionPct: Number(affiliate!.affiliate.commissionPct),
    code: affiliateCode!.toUpperCase(),
    ignoredCouponCode: couponCode,
  }
}
