import { db } from "@/lib/neon"
import {
  orders, events, coupons, couponRedemptions, wishlistItems, affiliates, affiliatePayouts,
  emailSubscribers, leads, reviews, gifts, materialRates, pieceCosts, categoryCosts, costMode,
} from "./schema"
import { eq, desc, and, gte, lte, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getOrders(limit = 50) {
  return db.select({
    id:           orders.id,
    ref:          orders.ref,
    customerName: orders.customerName,
    customerPhone:orders.customerPhone,
    items:        orders.items,
    total:        orders.total,
    advance:      orders.advance,
    status:       orders.status,
    channel:      orders.channel,
    couponCode:   orders.couponCode,
    affiliateCode:orders.affiliateCode,
    paymentMethod:orders.paymentMethod,
    paymentScreenshot: orders.paymentScreenshot,
    createdAt:    orders.createdAt,
  }).from(orders).orderBy(desc(orders.createdAt)).limit(limit)
}

export async function getOrdersByPhone(phone: string, limit = 50) {
  return db.select({
    id:           orders.id,
    ref:          orders.ref,
    items:        orders.items,
    subtotal:     orders.subtotal,
    discount:     orders.discount,
    total:        orders.total,
    status:       orders.status,
    couponCode:   orders.couponCode,
    createdAt:    orders.createdAt,
  }).from(orders).where(eq(orders.customerPhone, phone)).orderBy(desc(orders.createdAt)).limit(limit)
}

export async function getLatestOrderEmailByPhone(phone: string) {
  const rows = await db.select({ customerEmail: orders.customerEmail })
    .from(orders)
    .where(and(eq(orders.customerPhone, phone), sql`${orders.customerEmail} IS NOT NULL`))
    .orderBy(desc(orders.createdAt))
    .limit(1)
  return rows[0]?.customerEmail ?? null
}

export async function getLatestOrderPhoneByEmail(email: string) {
  const rows = await db.select({ customerPhone: orders.customerPhone })
    .from(orders)
    .where(eq(orders.customerEmail, email))
    .orderBy(desc(orders.createdAt))
    .limit(1)
  return rows[0]?.customerPhone ?? null
}

export async function getOrderByRef(ref: string, phone: string) {
  const rows = await db.select({
    id:              orders.id,
    ref:             orders.ref,
    customerName:    orders.customerName,
    customerPhone:   orders.customerPhone,
    items:           orders.items,
    subtotal:        orders.subtotal,
    discount:        orders.discount,
    advance:         orders.advance,
    total:           orders.total,
    paymentMethod:   orders.paymentMethod,
    deliveryMethod:  orders.deliveryMethod,
    deliveryArea:    orders.deliveryArea,
    status:          orders.status,
    createdAt:       orders.createdAt,
    updatedAt:       orders.updatedAt,
  }).from(orders).where(and(eq(orders.ref, ref), eq(orders.customerPhone, phone))).limit(1)
  return rows[0] ?? null
}

export async function createOrder(data: {
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryArea?: string
  deliveryAddress?: string
  deliveryMethod: string
  items: unknown
  subtotal: string
  discount: string
  advance: string
  total: string
  paymentMethod: string
  paymentScreenshot?: string
  couponCode?: string
  referralCode?: string
  affiliateCode?: string
  affiliateCommission?: string
  channel?: string
  notes?: string
}) {
  const ref = `YL-${nanoid(8).toUpperCase()}`
  const [row] = await db.insert(orders).values({ ...data, ref }).returning({ ref: orders.ref, id: orders.id })
  return row
}

export async function updateOrderStatus(ref: string, status: string) {
  return db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.ref, ref))
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function insertEvent(data: {
  sessionId: string
  event: string
  page?: string
  productId?: string
  meta?: unknown
}) {
  return db.insert(events).values(data)
}

export async function purgeOldEvents() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  return db.delete(events).where(lte(events.createdAt, sixMonthsAgo))
}

// ── Coupons ───────────────────────────────────────────────────────────────────

export async function validateCoupon(code: string, orderTotal: number, customerPhone?: string) {
  const rows = await db.select({
    id:            coupons.id,
    code:          coupons.code,
    type:          coupons.type,
    value:         coupons.value,
    minOrderValue: coupons.minOrderValue,
    maxUses:       coupons.maxUses,
    usedCount:     coupons.usedCount,
    perUserLimit:  coupons.perUserLimit,
    combinable:    coupons.combinable,
    expiresAt:     coupons.expiresAt,
    targetPhone:   coupons.targetPhone,
  }).from(coupons).where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.active, true))).limit(1)

  const coupon = rows[0]
  if (!coupon) return { valid: false, reason: "Coupon not found" }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, reason: "Coupon expired" }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses!) return { valid: false, reason: "Coupon fully used" }
  if (coupon.minOrderValue && orderTotal < Number(coupon.minOrderValue)) {
    return { valid: false, reason: `Minimum order Rs ${coupon.minOrderValue} required` }
  }
  if (coupon.targetPhone && coupon.targetPhone !== customerPhone) {
    return { valid: false, reason: "This code isn't valid for this account" }
  }
  if (coupon.perUserLimit && customerPhone) {
    const used = await db.select({ count: sql<number>`COUNT(*)` })
      .from(couponRedemptions)
      .where(and(eq(couponRedemptions.couponId, coupon.id), eq(couponRedemptions.customerPhone, customerPhone)))
    if (Number(used[0]?.count ?? 0) >= coupon.perUserLimit) {
      return { valid: false, reason: "You've already used this code" }
    }
  }
  const discountAmt = coupon.type === "percent"
    ? (orderTotal * Number(coupon.value)) / 100
    : Number(coupon.value)
  return { valid: true, coupon, discountAmt }
}

export async function incrementCouponUsage(id: number) {
  return db.update(coupons).set({ usedCount: sql`${coupons.usedCount} + 1` }).where(eq(coupons.id, id))
}

export async function createCouponRedemption(data: {
  couponId: number
  customerPhone: string
  orderRef: string
  orderValue: string
  discountApplied: string
}) {
  return db.insert(couponRedemptions).values(data)
}

export async function getCouponRedemptionsByPhone(phone: string) {
  return db.select({
    couponId:        couponRedemptions.couponId,
    orderRef:        couponRedemptions.orderRef,
    orderValue:      couponRedemptions.orderValue,
    discountApplied: couponRedemptions.discountApplied,
    redeemedAt:      couponRedemptions.redeemedAt,
  }).from(couponRedemptions).where(eq(couponRedemptions.customerPhone, phone)).orderBy(desc(couponRedemptions.redeemedAt))
}

export async function getCoupons(limit = 100) {
  return db.select().from(coupons).orderBy(desc(coupons.createdAt)).limit(limit)
}

export async function getTargetedCouponsForPhone(phone: string) {
  return db.select({
    id:         coupons.id,
    code:       coupons.code,
    type:       coupons.type,
    value:      coupons.value,
    expiresAt:  coupons.expiresAt,
    active:     coupons.active,
  }).from(coupons).where(and(eq(coupons.targetPhone, phone), eq(coupons.active, true)))
}

export async function createCoupon(data: {
  code: string
  type: string
  value: string
  minOrderValue?: string
  maxUses?: number
  perUserLimit?: number
  combinable?: boolean
  expiresAt?: Date
  notes?: string
  affiliateId?: number
  targetPhone?: string
}) {
  const [row] = await db.insert(coupons).values({ ...data, code: data.code.toUpperCase() }).returning({ id: coupons.id })
  return row
}

export async function toggleCouponActive(id: number, active: boolean) {
  return db.update(coupons).set({ active }).where(eq(coupons.id, id))
}

// Lightweight lookup for the public /coupon/[code] landing page — no order
// total to validate against yet, just enough to show a valid/expired state.
export async function getCouponPublicInfo(code: string) {
  const rows = await db.select({
    code:      coupons.code,
    type:      coupons.type,
    value:     coupons.value,
    expiresAt: coupons.expiresAt,
    active:    coupons.active,
  }).from(coupons).where(eq(coupons.code, code.toUpperCase())).limit(1)
  return rows[0] ?? null
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export async function getWishlistByToken(shareToken: string) {
  return db.select({
    productId:   wishlistItems.productId,
    productName: wishlistItems.productName,
    productSlug: wishlistItems.productSlug,
    price:       wishlistItems.price,
    finishName:  wishlistItems.finishName,
  }).from(wishlistItems).where(eq(wishlistItems.shareToken, shareToken))
}

export async function createWishlistShare(sessionId: string) {
  const token = nanoid(12)
  await db.update(wishlistItems).set({ shareToken: token }).where(eq(wishlistItems.sessionId, sessionId))
  return token
}

// ── Admin P&L aggregations ────────────────────────────────────────────────────

export async function getRevenueStats(from: Date, to: Date) {
  const rows = await db.select({
    total:  sql<string>`SUM(${orders.total})`,
    count:  sql<number>`COUNT(*)`,
    avg:    sql<string>`AVG(${orders.total})`,
  }).from(orders).where(
    and(
      gte(orders.createdAt, from),
      lte(orders.createdAt, to),
      sql`${orders.status} NOT IN ('cancelled', 'payment_pending')`
    )
  )
  return rows[0]
}

export async function getRevenueStatsByChannel(from: Date, to: Date) {
  const rows = await db.select({
    channel: orders.channel,
    total:   sql<string>`SUM(${orders.total})`,
    count:   sql<number>`COUNT(*)`,
    discount: sql<string>`SUM(${orders.discount})`,
    affiliateCommission: sql<string>`SUM(COALESCE(${orders.affiliateCommission}, 0))`,
  }).from(orders).where(
    and(
      gte(orders.createdAt, from),
      lte(orders.createdAt, to),
      sql`${orders.status} NOT IN ('cancelled', 'payment_pending')`
    )
  ).groupBy(orders.channel)
  return rows
}

// ── Affiliates ────────────────────────────────────────────────────────────────

export async function getAffiliateByCode(code: string) {
  const rows = await db.select({
    id:               affiliates.id,
    name:             affiliates.name,
    phone:            affiliates.phone,
    referralCode:     affiliates.referralCode,
    commissionPct:    affiliates.commissionPct,
    discountForBuyer: affiliates.discountForBuyer,
    approvedAt:       affiliates.approvedAt,
  }).from(affiliates).where(and(eq(affiliates.referralCode, code.toUpperCase()), eq(affiliates.active, true))).limit(1)
  return rows[0] ?? null
}

// Only an approved, active affiliate's code can win a discount at checkout.
export async function validateAffiliate(code: string) {
  const affiliate = await getAffiliateByCode(code)
  if (!affiliate) return { valid: false as const, reason: "Affiliate code not found" }
  if (!affiliate.approvedAt) return { valid: false as const, reason: "Affiliate not yet approved" }
  return { valid: true as const, affiliate, discountForBuyer: Number(affiliate.discountForBuyer) }
}

export async function getAffiliateByEmail(email: string) {
  const rows = await db.select().from(affiliates).where(eq(affiliates.email, email)).limit(1)
  return rows[0] ?? null
}

export async function getAffiliateById(id: number) {
  const rows = await db.select().from(affiliates).where(eq(affiliates.id, id)).limit(1)
  return rows[0] ?? null
}

export async function getAffiliates(limit = 100) {
  return db.select().from(affiliates).orderBy(desc(affiliates.createdAt)).limit(limit)
}

export async function createAffiliateApplication(data: {
  name: string
  phone: string
  email: string
  platform?: string
  handle?: string
  followerCount?: number
  contentType?: string
}) {
  const referralCode = `AFF-${nanoid(6).toUpperCase()}`
  const [row] = await db.insert(affiliates).values({
    ...data,
    referralCode,
    active: false,
    approvedAt: null,
  }).returning({ id: affiliates.id, referralCode: affiliates.referralCode })
  return row
}

export async function approveAffiliate(id: number) {
  return db.update(affiliates).set({ active: true, approvedAt: new Date() }).where(eq(affiliates.id, id))
}

export async function updateAffiliate(id: number, data: Partial<{
  commissionPct: string
  discountForBuyer: string
  platform: string
  handle: string
  followerCount: number
  contentType: string
  contentDeadline: Date
  contentLiveUrl: string
  collabNotes: string
  active: boolean
}>) {
  return db.update(affiliates).set(data).where(eq(affiliates.id, id))
}

export async function incrementAffiliateStats(id: number, orderValue: number, commission: number) {
  return db.update(affiliates).set({
    totalOrders: sql`${affiliates.totalOrders} + 1`,
    totalEarned: sql`${affiliates.totalEarned} + ${commission}`,
  }).where(eq(affiliates.id, id))
}

// ── Affiliate payouts ─────────────────────────────────────────────────────────

export async function createAffiliatePayout(data: {
  affiliateId: number
  orderRef: string
  orderValue: string
  payoutOwed: string
}) {
  return db.insert(affiliatePayouts).values(data)
}

export async function getAffiliatePayouts(limit = 100) {
  return db.select({
    id:           affiliatePayouts.id,
    affiliateId:  affiliatePayouts.affiliateId,
    affiliateName: affiliates.name,
    orderRef:     affiliatePayouts.orderRef,
    orderValue:   affiliatePayouts.orderValue,
    payoutOwed:   affiliatePayouts.payoutOwed,
    payoutStatus: affiliatePayouts.payoutStatus,
    paidAt:       affiliatePayouts.paidAt,
    createdAt:    affiliatePayouts.createdAt,
  }).from(affiliatePayouts)
    .leftJoin(affiliates, eq(affiliatePayouts.affiliateId, affiliates.id))
    .orderBy(desc(affiliatePayouts.createdAt))
    .limit(limit)
}

export async function getAffiliatePayoutsByAffiliate(affiliateId: number) {
  return db.select().from(affiliatePayouts)
    .where(eq(affiliatePayouts.affiliateId, affiliateId))
    .orderBy(desc(affiliatePayouts.createdAt))
}

export async function markPayoutPaid(id: number, paymentRef?: string) {
  const [row] = await db.update(affiliatePayouts)
    .set({ payoutStatus: "paid", paidAt: new Date(), paymentRef })
    .where(eq(affiliatePayouts.id, id))
    .returning({ affiliateId: affiliatePayouts.affiliateId, payoutOwed: affiliatePayouts.payoutOwed })
  if (row) {
    await db.update(affiliates).set({
      totalPaid: sql`${affiliates.totalPaid} + ${row.payoutOwed}`,
    }).where(eq(affiliates.id, row.affiliateId))
  }
  return row
}

// ── Email subscribers ─────────────────────────────────────────────────────────

export async function addEmailSubscriber(email: string, source: string) {
  return db.insert(emailSubscribers).values({ email, source }).onConflictDoNothing()
}

// ── Leads (inquiry inbox) ──────────────────────────────────────────────────────

export async function getLeads(limit = 100) {
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit)
}

export async function createLead(data: {
  name: string
  phone: string
  productSlug?: string
  message?: string
  source?: string
}) {
  return db.insert(leads).values(data)
}

export async function markLeadFollowedUp(id: number, followedUp: boolean) {
  return db.update(leads).set({ followedUp }).where(eq(leads.id, id))
}

// ── Reviews (moderation) ────────────────────────────────────────────────────────

export async function getReviews(limit = 100) {
  return db.select().from(reviews).orderBy(desc(reviews.createdAt)).limit(limit)
}

export async function getApprovedReviewsByProduct(productSlug: string) {
  return db.select().from(reviews).where(and(eq(reviews.productSlug, productSlug), eq(reviews.approved, true)))
}

export async function createReview(data: {
  productSlug: string
  name: string
  rating: number
  body: string
  photoUrl?: string
}) {
  return db.insert(reviews).values(data)
}

export async function setReviewApproved(id: number, approved: boolean) {
  return db.update(reviews).set({ approved }).where(eq(reviews.id, id))
}

// ── Gifts / thank-you tracker ───────────────────────────────────────────────────

export async function getGifts(limit = 100) {
  return db.select({
    id:                 gifts.id,
    orderRef:           gifts.orderRef,
    giftTier:           gifts.giftTier,
    giftGivenAt:        gifts.giftGivenAt,
    thankyouCodeSent:   gifts.thankyouCodeSent,
    thankyouCodeSentAt: gifts.thankyouCodeSentAt,
    createdAt:          gifts.createdAt,
    customerName:       orders.customerName,
    customerPhone:      orders.customerPhone,
  }).from(gifts)
    .leftJoin(orders, eq(gifts.orderRef, orders.ref))
    .orderBy(desc(gifts.createdAt))
    .limit(limit)
}

export async function ensureGiftEntry(orderRef: string) {
  return db.insert(gifts).values({ orderRef }).onConflictDoNothing()
}

export async function markGiftGiven(id: number, giftTier: string) {
  return db.update(gifts).set({ giftTier, giftGivenAt: new Date() }).where(eq(gifts.id, id))
}

export async function markThankyouCodeSent(id: number) {
  return db.update(gifts).set({ thankyouCodeSent: true, thankyouCodeSentAt: new Date() }).where(eq(gifts.id, id))
}

// ── Cost sheet (material rates, per-piece BOM, category averages) ──────────────

export async function getMaterialRates() {
  return db.select().from(materialRates)
}

export async function upsertMaterialRate(key: string, label: string, rate: string, unit: string) {
  return db.insert(materialRates).values({ key, label, rate, unit })
    .onConflictDoUpdate({ target: materialRates.key, set: { rate, label, unit, updatedAt: new Date() } })
}

export async function getPieceCosts() {
  return db.select().from(pieceCosts)
}

export async function upsertPieceCost(data: {
  pieceType: string
  label: string
  sheets16mm: string
  thinSheets: string
  thapary: boolean
  foam: boolean
  mirror: boolean
  hardwareCost: string
  labourCost: string
  decoCost: string
}) {
  return db.insert(pieceCosts).values(data)
    .onConflictDoUpdate({ target: pieceCosts.pieceType, set: { ...data, updatedAt: new Date() } })
}

export async function getCategoryCosts() {
  return db.select().from(categoryCosts)
}

export async function upsertCategoryCost(categorySlug: string, manufacturingCost: string, showroomMarginPct: string) {
  return db.insert(categoryCosts).values({ categorySlug, manufacturingCost, showroomMarginPct })
    .onConflictDoUpdate({ target: categoryCosts.categorySlug, set: { manufacturingCost, showroomMarginPct, updatedAt: new Date() } })
}

export async function getCostModes() {
  return db.select().from(costMode)
}

export async function setCostMode(categorySlug: string, mode: "average" | "per_product") {
  return db.insert(costMode).values({ categorySlug, mode })
    .onConflictDoUpdate({ target: costMode.categorySlug, set: { mode } })
}
