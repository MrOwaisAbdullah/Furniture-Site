import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createOrder, incrementCouponUsage, createCouponRedemption, createAffiliatePayout, incrementAffiliateStats } from "@/lib/neon/queries"
import { sendOrderConfirmation } from "@/lib/email"
import { pushRecentOrder } from "@/lib/redis"
import { resolveDiscount } from "@/lib/discount"

const checkoutSchema = z.object({
  customerName:    z.string().min(2).max(100),
  customerPhone:   z.string().regex(/^(\+92|0)?3\d{9}$/, "Invalid Pakistan mobile number"),
  customerEmail:   z.string().email().optional().or(z.literal("")),
  deliveryArea:    z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryMethod:  z.enum(["delivery", "showroom"]),
  items: z.array(z.object({
    productId:   z.string(),
    name:        z.string(),
    price:       z.number().min(0),
    qty:         z.number().int().min(1),
    variantId:   z.string().optional(),
    finishId:    z.string().optional(),
    finishName:  z.string().optional(),
  })).min(1),
  subtotal:      z.number().min(0),
  discount:      z.number().min(0).default(0),
  advance:       z.number().min(0),
  paymentMethod: z.enum(["bank", "easypaisa", "cash"]),
  paymentScreenshot: z.string().url().optional().or(z.literal("")),
  couponCode:    z.string().optional(),
  referralCode:  z.string().optional(),
  affiliateCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 })
    }

    const data = parsed.data

    // Discount stacking: only one discount per order (unless a coupon is
    // explicitly marked combinable) — resolveDiscount picks the higher of
    // coupon vs affiliate code and ignores the other.
    const resolved = await resolveDiscount(data.couponCode, data.affiliateCode, data.subtotal, data.customerPhone)
    const finalDiscount = resolved.discount > 0 ? resolved.discount : data.discount
    const total = data.subtotal - finalDiscount

    const affiliateCommission = resolved.type === "affiliate"
      ? (data.subtotal * resolved.commissionPct) / 100
      : undefined

    const created = await createOrder({
      customerName:      data.customerName,
      customerPhone:     data.customerPhone,
      customerEmail:     data.customerEmail ? data.customerEmail : undefined,
      deliveryArea:      data.deliveryArea,
      deliveryAddress:   data.deliveryAddress,
      deliveryMethod:    data.deliveryMethod,
      items:             data.items,
      subtotal:          data.subtotal.toFixed(2),
      discount:          finalDiscount.toFixed(2),
      advance:           data.advance.toFixed(2),
      total:             total.toFixed(2),
      paymentMethod:     data.paymentMethod,
      paymentScreenshot: data.paymentScreenshot || undefined,
      couponCode:        resolved.type === "coupon" ? resolved.code : undefined,
      referralCode:      data.referralCode,
      affiliateCode:     resolved.type === "affiliate" ? resolved.code : undefined,
      affiliateCommission: affiliateCommission?.toFixed(2),
      channel:           "online",
    })

    if (!created) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Record the winning discount's bookkeeping (non-blocking on failure).
    if (resolved.type === "coupon") {
      await incrementCouponUsage(resolved.couponId).catch(() => {})
      await createCouponRedemption({
        couponId: resolved.couponId,
        customerPhone: data.customerPhone,
        orderRef: created.ref,
        orderValue: data.subtotal.toFixed(2),
        discountApplied: resolved.discount.toFixed(2),
      }).catch(() => {})
    } else if (resolved.type === "affiliate" && affiliateCommission !== undefined) {
      await createAffiliatePayout({
        affiliateId: resolved.affiliateId,
        orderRef: created.ref,
        orderValue: data.subtotal.toFixed(2),
        payoutOwed: affiliateCommission.toFixed(2),
      }).catch(() => {})
      await incrementAffiliateStats(resolved.affiliateId, data.subtotal, affiliateCommission).catch(() => {})
    }

    // Push social proof ticker (non-blocking)
    const area = data.deliveryArea ?? "Karachi"
    for (const item of data.items) {
      pushRecentOrder(item.productId, { name: data.customerName.split(" ")[0] ?? data.customerName, area, hoursAgo: 0 }).catch(() => {})
    }

    // Send confirmation email (non-blocking)
    if (data.customerEmail) {
      sendOrderConfirmation({
        to:             data.customerEmail,
        orderRef:       created.ref,
        customerName:   data.customerName,
        items:          data.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
        total,
        advance:        data.advance,
        deliveryMethod: data.deliveryMethod,
      }).catch(() => {})
    }

    return NextResponse.json({ ref: created.ref }, { status: 201 })
  } catch (err) {
    console.error("[checkout] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
