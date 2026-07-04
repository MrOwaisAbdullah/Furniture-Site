import {
  pgTable, text, integer, boolean, timestamp, serial,
  decimal, jsonb, index,
} from "drizzle-orm/pg-core"

// ── Orders ────────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id:              serial("id").primaryKey(),
  ref:             text("ref").notNull().unique(),
  customerName:    text("customer_name").notNull(),
  customerPhone:   text("customer_phone").notNull(),
  customerEmail:   text("customer_email"),
  deliveryArea:    text("delivery_area"),
  deliveryAddress: text("delivery_address"),
  deliveryMethod:  text("delivery_method").notNull().default("delivery"),
  items:           jsonb("items").notNull(),
  subtotal:        decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discount:        decimal("discount",  { precision: 12, scale: 2 }).notNull().default("0"),
  advance:         decimal("advance",   { precision: 12, scale: 2 }).notNull(),
  total:           decimal("total",     { precision: 12, scale: 2 }).notNull(),
  paymentMethod:   text("payment_method").notNull(),
  paymentScreenshot: text("payment_screenshot"),
  couponCode:      text("coupon_code"),
  referralCode:    text("referral_code"),
  affiliateCode:   text("affiliate_code"),
  affiliateCommission: decimal("affiliate_commission", { precision: 12, scale: 2 }),
  channel:         text("channel").notNull().default("online"), // "online" | "showroom"
  status:          text("status").notNull().default("payment_pending"),
  notes:           text("notes"),
  createdAt:       timestamp("created_at").defaultNow().notNull(),
  updatedAt:       timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
  index("orders_phone_idx").on(t.customerPhone),
  index("orders_status_idx").on(t.status),
  index("orders_created_idx").on(t.createdAt),
  index("orders_channel_idx").on(t.channel),
])

// ── Events (analytics) ────────────────────────────────────────────────────────

export const events = pgTable("events", {
  id:        serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  event:     text("event").notNull(),
  page:      text("page"),
  productId: text("product_id"),
  meta:      jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("events_session_idx").on(t.sessionId),
  index("events_event_idx").on(t.event),
  index("events_created_idx").on(t.createdAt),
])

// ── Coupons ───────────────────────────────────────────────────────────────────

export const coupons = pgTable("coupons", {
  id:             serial("id").primaryKey(),
  code:           text("code").notNull().unique(),
  type:           text("type").notNull(),   // "percent" | "flat"
  value:          decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrderValue:  decimal("min_order_value", { precision: 12, scale: 2 }),
  maxUses:        integer("max_uses"),
  usedCount:      integer("used_count").notNull().default(0),
  perUserLimit:   integer("per_user_limit"),
  combinable:     boolean("combinable").notNull().default(false),
  expiresAt:      timestamp("expires_at"),
  active:         boolean("active").notNull().default(true),
  notes:          text("notes"),
  affiliateId:    integer("affiliate_id").references(() => affiliates.id),
  // Set only for a coupon assigned to one specific customer (e.g. a
  // targeted wishlist-abandon discount) — visible/redeemable only by them.
  targetPhone:    text("target_phone"),
  createdAt:      timestamp("created_at").defaultNow().notNull(),
})

export const couponRedemptions = pgTable("coupon_redemptions", {
  id:               serial("id").primaryKey(),
  couponId:         integer("coupon_id").notNull().references(() => coupons.id),
  customerPhone:    text("customer_phone").notNull(),
  orderRef:         text("order_ref").notNull(),
  orderValue:       decimal("order_value", { precision: 12, scale: 2 }).notNull(),
  discountApplied:  decimal("discount_applied", { precision: 12, scale: 2 }).notNull(),
  redeemedAt:       timestamp("redeemed_at").defaultNow().notNull(),
}, (t) => [
  index("coupon_redemptions_phone_idx").on(t.customerPhone),
  index("coupon_redemptions_coupon_idx").on(t.couponId),
])

// ── Affiliates ────────────────────────────────────────────────────────────────

export const affiliates = pgTable("affiliates", {
  id:           serial("id").primaryKey(),
  name:         text("name").notNull(),
  phone:        text("phone").notNull().unique(),
  email:        text("email"), // required for the OTP self-service dashboard
  referralCode: text("referral_code").notNull().unique(),
  commissionPct: decimal("commission_pct", { precision: 5, scale: 2 }).notNull().default("5"),
  discountForBuyer: decimal("discount_for_buyer", { precision: 10, scale: 2 }).notNull().default("0"),
  // Collab / content-partnership tracking
  platform:         text("platform"),          // instagram | tiktok | facebook | ...
  handle:           text("handle"),
  followerCount:    integer("follower_count"),
  contentType:      text("content_type"),       // reel | post | story | ...
  contentDeadline:  timestamp("content_deadline"),
  contentLiveUrl:   text("content_live_url"),
  collabNotes:      text("collab_notes"),
  totalOrders:  integer("total_orders").notNull().default(0),
  totalEarned:  decimal("total_earned", { precision: 12, scale: 2 }).notNull().default("0"),
  totalPaid:    decimal("total_paid", { precision: 12, scale: 2 }).notNull().default("0"),
  active:       boolean("active").notNull().default(true),
  // null = pending admin approval; set when an admin approves the application
  approvedAt:   timestamp("approved_at"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
})

export const affiliatePayouts = pgTable("affiliate_payouts", {
  id:           serial("id").primaryKey(),
  affiliateId:  integer("affiliate_id").notNull().references(() => affiliates.id),
  orderRef:     text("order_ref").notNull(),
  orderValue:   decimal("order_value", { precision: 12, scale: 2 }).notNull(),
  payoutOwed:   decimal("payout_owed", { precision: 12, scale: 2 }).notNull(),
  payoutStatus: text("payout_status").notNull().default("owed"), // owed | paid
  paidAt:       timestamp("paid_at"),
  paymentRef:   text("payment_ref"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("affiliate_payouts_affiliate_idx").on(t.affiliateId),
  index("affiliate_payouts_status_idx").on(t.payoutStatus),
])

// ── Wishlist (server-side, keyed by session) ──────────────────────────────────

export const wishlistItems = pgTable("wishlist_items", {
  id:          serial("id").primaryKey(),
  sessionId:   text("session_id").notNull(),
  shareToken:  text("share_token"),
  productId:   text("product_id").notNull(),
  productName: text("product_name").notNull(),
  productSlug: text("product_slug").notNull(),
  price:       decimal("price", { precision: 12, scale: 2 }).notNull(),
  finishName:  text("finish_name"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("wishlist_session_idx").on(t.sessionId),
  index("wishlist_token_idx").on(t.shareToken),
])

// ── Email subscribers ─────────────────────────────────────────────────────────

export const emailSubscribers = pgTable("email_subscribers", {
  id:          serial("id").primaryKey(),
  email:       text("email").notNull().unique(),
  source:      text("source").notNull().default("footer"),
  createdAt:   timestamp("created_at").defaultNow().notNull(),
})

// ── Cost sheet (per-piece BOM model — see docs/furniture-cost-pricing-model-v5.xlsx) ──

// Global, editable material rates. Changing a rate here recalculates every
// piece cost that references it (spec's "global rate override" rule).
export const materialRates = pgTable("material_rates", {
  id:        serial("id").primaryKey(),
  key:       text("key").notNull().unique(), // mdf16mm | thinBoard | foamRexinePerBed | mirrorGlass | thapary
  label:     text("label").notNull(),
  rate:      decimal("rate", { precision: 10, scale: 2 }).notNull(),
  unit:      text("unit").notNull(), // "per sheet" | "per bed" | "per unit"
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Per-piece bill of materials. pieceTotal is computed at read time from
// materialRates × quantities + the flat hardware/labour/deco costs, not
// stored — so a rate change is reflected immediately everywhere.
export const pieceCosts = pgTable("piece_costs", {
  id:            serial("id").primaryKey(),
  pieceType:     text("piece_type").notNull().unique(), // bed | side_tables_pair | dressing_table | wardrobe_3door
  label:         text("label").notNull(),
  sheets16mm:    decimal("sheets_16mm", { precision: 6, scale: 2 }).notNull().default("0"),
  thinSheets:    decimal("thin_sheets", { precision: 6, scale: 2 }).notNull().default("0"),
  thapary:       boolean("thapary").notNull().default(false),
  foam:          boolean("foam").notNull().default(false),
  mirror:        boolean("mirror").notNull().default(false),
  hardwareCost:  decimal("hardware_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  labourCost:    decimal("labour_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  decoCost:      decimal("deco_cost", { precision: 10, scale: 2 }).notNull().default("0"),
  updatedAt:     timestamp("updated_at").defaultNow().notNull(),
})

// Mode 1 — quick category-level average cost, used when no per-product
// detail has been entered yet for that category.
export const categoryCosts = pgTable("category_costs", {
  id:                serial("id").primaryKey(),
  categorySlug:      text("category_slug").notNull().unique(),
  manufacturingCost: decimal("manufacturing_cost", { precision: 12, scale: 2 }).notNull(),
  showroomMarginPct: decimal("showroom_margin_pct", { precision: 5, scale: 2 }).notNull().default("20"),
  updatedAt:         timestamp("updated_at").defaultNow().notNull(),
})

// Per-category toggle: "average" falls back to categoryCosts, "per_product"
// uses the piece-level BOM roll-up instead.
export const costMode = pgTable("cost_mode", {
  id:           serial("id").primaryKey(),
  categorySlug: text("category_slug").notNull().unique(),
  mode:         text("mode").notNull().default("average"), // "average" | "per_product"
})

// Per-product cost entry, matching the admin dashboard design's cost sheet
// table. Material line items (board/foam/rexine/patex) are QUANTITIES —
// the actual PKR amount is quantity × the shared global rate from
// materialRates, so a rate change recalculates every product automatically.
// Hardware/labour/deco/wastage stay flat PKR since they're genuinely bespoke
// per product, not a quantity of a shared material.
// A product with a row here always overrides its category's average — see
// resolveProductCost() in queries.ts.
export const productCosts = pgTable("product_costs", {
  id:           serial("id").primaryKey(),
  productSlug:  text("product_slug").notNull().unique(),
  categorySlug: text("category_slug").notNull(),
  boardQty:     decimal("board_qty", { precision: 6, scale: 2 }).notNull().default("0"),  // sheets of MDF/Lasani
  foamQty:      decimal("foam_qty", { precision: 6, scale: 2 }).notNull().default("0"),   // units of foam (per bed)
  rexineQty:    decimal("rexine_qty", { precision: 6, scale: 2 }).notNull().default("0"), // units of rexine (per bed)
  patexQty:     decimal("patex_qty", { precision: 6, scale: 2 }).notNull().default("0"),  // sheets of patex/sunmica — 0 for most
  hardware:     decimal("hardware", { precision: 10, scale: 2 }).notNull().default("0"),
  labour:       decimal("labour", { precision: 10, scale: 2 }).notNull().default("0"),
  deco:         decimal("deco", { precision: 10, scale: 2 }).notNull().default("0"),
  wastage:      decimal("wastage", { precision: 10, scale: 2 }).notNull().default("0"),
  marginPct:    decimal("margin_pct", { precision: 5, scale: 2 }).notNull().default("40"),
  updatedAt:    timestamp("updated_at").defaultNow().notNull(),
})

// ── Leads (inquiry inbox) ──────────────────────────────────────────────────────

export const leads = pgTable("leads", {
  id:           serial("id").primaryKey(),
  name:         text("name").notNull(),
  phone:        text("phone").notNull(),
  productSlug:  text("product_slug"),
  message:      text("message"),
  source:       text("source").notNull().default("contact_form"),
  followedUp:   boolean("followed_up").notNull().default(false),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("leads_followed_up_idx").on(t.followedUp),
])

// ── Reviews (pending moderation) ───────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id:           serial("id").primaryKey(),
  productSlug:  text("product_slug").notNull(),
  name:         text("name").notNull(),
  rating:       integer("rating").notNull(),
  body:         text("body").notNull(),
  photoUrl:     text("photo_url"),
  approved:     boolean("approved").notNull().default(false),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  index("reviews_product_idx").on(t.productSlug),
  index("reviews_approved_idx").on(t.approved),
])

// ── Gifts / post-delivery thank-you tracker ────────────────────────────────────

export const gifts = pgTable("gifts", {
  id:                  serial("id").primaryKey(),
  orderRef:            text("order_ref").notNull().unique(),
  giftTier:            text("gift_tier"),
  giftGivenAt:         timestamp("gift_given_at"),
  thankyouCodeSent:    boolean("thankyou_code_sent").notNull().default(false),
  thankyouCodeSentAt:  timestamp("thankyou_code_sent_at"),
  createdAt:           timestamp("created_at").defaultNow().notNull(),
})

// ── Admin auth (BetterAuth) ────────────────────────────────────────────────────
// Follows BetterAuth's canonical schema exactly (user/session/account/verification)
// — the password hash lives on `account` (providerId "credential"), not on the
// user row, and BetterAuth requires emailVerified/updatedAt on every user.

export const adminUsers = pgTable("admin_users", {
  id:            text("id").primaryKey(),
  email:         text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name:          text("name").notNull(),
  image:         text("image"),
  createdAt:     timestamp("created_at").defaultNow().notNull(),
  updatedAt:     timestamp("updated_at").defaultNow().notNull(),
})

export const adminSessions = pgTable("admin_sessions", {
  id:        text("id").primaryKey(),
  userId:    text("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  token:     text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const adminAccounts = pgTable("admin_accounts", {
  id:                    text("id").primaryKey(),
  accountId:             text("account_id").notNull(),
  providerId:            text("provider_id").notNull(),
  userId:                text("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  accessToken:           text("access_token"),
  refreshToken:          text("refresh_token"),
  idToken:               text("id_token"),
  accessTokenExpiresAt:  timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope:                 text("scope"),
  password:              text("password"), // credential provider stores the hash here
  createdAt:             timestamp("created_at").defaultNow().notNull(),
  updatedAt:             timestamp("updated_at").defaultNow().notNull(),
})

export const adminVerifications = pgTable("admin_verifications", {
  id:         text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value:      text("value").notNull(),
  expiresAt:  timestamp("expires_at").notNull(),
  createdAt:  timestamp("created_at").defaultNow().notNull(),
  updatedAt:  timestamp("updated_at").defaultNow().notNull(),
})
