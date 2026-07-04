/**
 * Seeds realistic demo data so the admin Dashboard/Reports pages have
 * something to show: orders (this month + last month, online + showroom),
 * funnel/search/wishlist events, coupons + redemptions, affiliates + payouts.
 *
 * Every row is tagged with a "demo" marker so `remove-dashboard-demo-data.ts`
 * can delete exactly this data and nothing else:
 *   - orders.ref            LIKE 'YL-DEMO-%'
 *   - events.session_id     LIKE 'demo-%'
 *   - coupons.code          LIKE 'DEMO%'
 *   - affiliates.phone      LIKE '03009%' (reserved demo range)
 *
 * Run:   node_modules/.bin/tsx scripts/seed-dashboard-demo-data.ts
 * Undo:  node_modules/.bin/tsx scripts/remove-dashboard-demo-data.ts
 */
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

const PRODUCTS = [
  { id: "prod-1", name: "King Foam Bed (Walnut)", price: 65000, weight: 5 },
  { id: "prod-2", name: "3-Door Wardrobe (Walnut)", price: 85000, weight: 3 },
  { id: "prod-3", name: "Dressing Table with Mirror (Walnut)", price: 45000, weight: 3 },
  { id: "prod-4", name: "Side Table Pair (Walnut)", price: 25000, weight: 2 },
  { id: "prod-5", name: "Full Bedroom Set — Tier 3", price: 330000, weight: 2 },
]

const SEARCH_TERMS = [
  { term: "bed", resultCount: 3 },
  { term: "wardrobe", resultCount: 2 },
  { term: "dressing table", resultCount: 1 },
  { term: "wooden bed king size", resultCount: 1 },
  { term: "almirah", resultCount: 2 },
  { term: "bedroom set", resultCount: 1 },
  { term: "side table", resultCount: 1 },
  { term: "sofa", resultCount: 0 },
  { term: "dining table", resultCount: 0 },
]

const CUSTOMER_NAMES = [
  "Ahmed Khan", "Fatima Malik", "Bilal Sheikh", "Ayesha Siddiqui", "Usman Tariq",
  "Sana Riaz", "Hamza Iqbal", "Zainab Hussain", "Omar Farooq", "Mariam Aslam",
  "Kashif Baig", "Sadia Noor", "Tariq Mehmood", "Nida Yousuf", "Faisal Chaudhry",
]

const AREAS = ["DHA", "Clifton", "Gulshan-e-Iqbal", "North Nazimabad", "Gulberg"]

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function weightedProduct() {
  const total = PRODUCTS.reduce((s, p) => s + p.weight, 0)
  let r = Math.random() * total
  for (const p of PRODUCTS) {
    if (r < p.weight) return p
    r -= p.weight
  }
  return PRODUCTS[0]!
}
function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(randInt(9, 21), randInt(0, 59), 0, 0)
  return d
}
// Dashboard/Reports "this month"/"last month" queries use CALENDAR month
// boundaries (1st of month → now), not a rolling day count — so seed data
// must land inside those actual calendar boundaries, not N days back.
function dateInCurrentMonth() {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  return new Date(monthStart + Math.random() * (now.getTime() - monthStart))
}
function dateInPreviousMonth() {
  const now = new Date()
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 1).getTime() - 1
  return new Date(prevStart + Math.random() * (prevEnd - prevStart))
}
function demoPhone(i: number) {
  return `0300${String(9000000 + i).slice(0, 7)}`
}

async function main() {
  console.log("Seeding demo data…")

  // ── Affiliates ──────────────────────────────────────────────────────────
  const affiliateRows = [
    { name: "Sara Vlogs", phone: demoPhone(1), email: "sara.demo@example.com", referralCode: "DEMOSARA10", commissionPct: "8", discountForBuyer: "3000", totalOrders: 14, totalEarned: "68000", totalPaid: "40000", approved: true },
    { name: "Karachi Home Tours", phone: demoPhone(2), email: "kht.demo@example.com", referralCode: "DEMOKHT15", commissionPct: "6", discountForBuyer: "2000", totalOrders: 6, totalEarned: "24000", totalPaid: "24000", approved: true },
    { name: "Bridal Room Ideas", phone: demoPhone(3), email: "bridal.demo@example.com", referralCode: "DEMOBRIDAL", commissionPct: "10", discountForBuyer: "5000", totalOrders: 0, totalEarned: "0", totalPaid: "0", approved: true },
  ]
  const affiliateIds: number[] = []
  for (const a of affiliateRows) {
    const [row] = await sql`
      INSERT INTO affiliates (name, phone, email, referral_code, commission_pct, discount_for_buyer, total_orders, total_earned, total_paid, active, approved_at)
      VALUES (${a.name}, ${a.phone}, ${a.email}, ${a.referralCode}, ${a.commissionPct}, ${a.discountForBuyer}, ${a.totalOrders}, ${a.totalEarned}, ${a.totalPaid}, true, ${a.approved ? new Date(Date.now() - 60 * 86400000).toISOString() : null})
      ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `
    affiliateIds.push(row!.id)
  }
  console.log(`  affiliates: ${affiliateIds.length}`)

  // Payouts for the top two affiliates
  const payoutSpecs = [
    { affiliateId: affiliateIds[0], orderValue: 65000, payoutOwed: 5200, status: "owed" },
    { affiliateId: affiliateIds[0], orderValue: 85000, payoutOwed: 6800, status: "paid" },
    { affiliateId: affiliateIds[1], orderValue: 45000, payoutOwed: 2700, status: "owed" },
  ]
  let payoutCount = 0
  for (const [i, p] of payoutSpecs.entries()) {
    const ref = `YL-DEMO-PO${i}`
    await sql`
      INSERT INTO affiliate_payouts (affiliate_id, order_ref, order_value, payout_owed, payout_status, paid_at)
      VALUES (${p.affiliateId}, ${ref}, ${p.orderValue}, ${p.payoutOwed}, ${p.status}, ${p.status === "paid" ? new Date().toISOString() : null})
    `
    payoutCount++
  }
  console.log(`  affiliate payouts: ${payoutCount}`)

  // ── Coupons ─────────────────────────────────────────────────────────────
  const couponRows = [
    { code: "DEMOWELCOME10", type: "percent", value: "10", maxUses: 100, usedCount: 18 },
    { code: "DEMOEID2000", type: "flat", value: "2000", maxUses: 50, usedCount: 9 },
    { code: "DEMOSHAADI15", type: "percent", value: "15", maxUses: 30, usedCount: 4 },
  ]
  const couponIds: Record<string, number> = {}
  for (const c of couponRows) {
    const [row] = await sql`
      INSERT INTO coupons (code, type, value, max_uses, used_count, active)
      VALUES (${c.code}, ${c.type}, ${c.value}, ${c.maxUses}, ${c.usedCount}, true)
      ON CONFLICT (code) DO UPDATE SET used_count = EXCLUDED.used_count
      RETURNING id
    `
    couponIds[c.code] = row!.id
  }
  console.log(`  coupons: ${Object.keys(couponIds).length}`)

  // ── Orders (this month + last month, online + showroom) ───────────────
  const statusPool = ["payment_pending", "payment_confirmed", "building", "polishing", "finishing", "ready", "delivered", "delivered", "delivered"]
  let orderIndex = 0
  let orderCount = 0

  async function seedOrdersForRange(period: "thisMonth" | "lastMonth", count: number) {
    for (let i = 0; i < count; i++) {
      orderIndex++
      const ref = `YL-DEMO-${String(orderIndex).padStart(4, "0")}`
      const product = weightedProduct()
      const qty = product.id === "prod-4" ? randInt(1, 2) : 1
      const subtotal = product.price * qty
      const channel = Math.random() < 0.72 ? "online" : "showroom"
      const useCoupon = channel === "online" && Math.random() < 0.25
      const useAffiliate = !useCoupon && channel === "online" && Math.random() < 0.15
      const discount = useCoupon ? Math.round(subtotal * 0.1) : 0
      const affiliateCommission = useAffiliate ? Math.round(subtotal * 0.08) : 0
      const total = subtotal - discount
      const createdAt = period === "thisMonth" ? dateInCurrentMonth() : dateInPreviousMonth()
      const status = rand(statusPool)

      await sql`
        INSERT INTO orders (
          ref, customer_name, customer_phone, delivery_area, delivery_method, items,
          subtotal, discount, advance, total, payment_method,
          coupon_code, affiliate_code, affiliate_commission, channel, status, created_at, updated_at
        ) VALUES (
          ${ref}, ${rand(CUSTOMER_NAMES)}, ${demoPhone(100 + orderIndex)}, ${rand(AREAS)}, 'delivery',
          ${JSON.stringify([{ productId: product.id, name: product.name, price: product.price, qty }])},
          ${subtotal}, ${discount}, ${Math.round(total / 2)}, ${total}, 'bank',
          ${useCoupon ? "DEMOWELCOME10" : null}, ${useAffiliate ? "DEMOSARA10" : null},
          ${useAffiliate ? affiliateCommission : null}, ${channel}, ${status}, ${createdAt.toISOString()}, ${createdAt.toISOString()}
        )
      `

      if (useCoupon) {
        await sql`
          INSERT INTO coupon_redemptions (coupon_id, customer_phone, order_ref, order_value, discount_applied, redeemed_at)
          VALUES (${couponIds["DEMOWELCOME10"]}, ${demoPhone(100 + orderIndex)}, ${ref}, ${subtotal}, ${discount}, ${createdAt.toISOString()})
        `
      }
      orderCount++
    }
  }

  await seedOrdersForRange("thisMonth", 30)
  await seedOrdersForRange("lastMonth", 20) // comparison baseline for period-over-period deltas
  console.log(`  orders: ${orderCount}`)

  // ── Events (funnel, wishlist, search) ──────────────────────────────────
  // Collected into arrays and inserted in one bulk statement via unnest() —
  // ~700 individual round-trips to Neon's HTTP driver would take minutes.
  const pendingEvents: { sessionId: string; event: string; productId: string | null; meta: string | null; createdAt: string }[] = []
  function insertEvent(sessionId: string, event: string, createdAt: Date, productId?: string, meta?: object) {
    pendingEvents.push({
      sessionId, event,
      productId: productId ?? null,
      meta: meta ? JSON.stringify(meta) : null,
      createdAt: createdAt.toISOString(),
    })
  }

  // Funnel: ~420 views -> ~150 add_to_cart -> ~70 checkout_started -> ~45 step_completed -> ~30 order_completed
  // All dated within the current calendar month — the funnel/wishlist/search
  // queries filter by (monthStart, now), not a rolling day count.
  for (let i = 0; i < 420; i++) {
    const sessionId = `demo-sess-${i}`
    const product = weightedProduct()
    const viewedAt = dateInCurrentMonth()
    await insertEvent(sessionId, "product_view", viewedAt, product.id, { name: product.name, categorySlug: "beds", price: product.price })

    if (i % 3 === 0) { // ~35% wishlist
      await insertEvent(sessionId, "wishlist_add", new Date(viewedAt.getTime() + 60000), product.id, { name: product.name })
    }
    if (i < 150) {
      await insertEvent(sessionId, "add_to_cart", new Date(viewedAt.getTime() + 120000), product.id, { name: product.name, price: product.price, qty: 1 })
      if (i < 70) {
        await insertEvent(sessionId, "checkout_started", new Date(viewedAt.getTime() + 180000), undefined, { itemCount: 1, subtotal: product.price })
        if (i < 45) {
          await insertEvent(sessionId, "checkout_step_completed", new Date(viewedAt.getTime() + 240000), undefined, { step: rand(["details", "delivery", "review"]) })
          if (i < 30) {
            await insertEvent(sessionId, "order_completed", new Date(viewedAt.getTime() + 300000), undefined, { orderRef: `YL-DEMO-VIRT${i}`, total: product.price, itemCount: 1 })
          }
        }
      }
    }
  }

  // Trending-comparison window: getTrendingProducts() compares the last 7
  // days against the 7 before that (rolling, not calendar-month-based) — so
  // this needs real spread across both windows to show real +/- movement,
  // not just "everything is new" flatline.
  // Bed: trending up (more in recent window). Dressing table: trending down.
  // Wardrobe: flat. Side table / set: recent-only (genuinely new interest).
  for (let i = 0; i < 40; i++) await insertEvent(`demo-trend-bed-r${i}`, "product_view", daysAgo(randInt(0, 6)), "prod-1", { name: PRODUCTS[0]!.name, categorySlug: "beds", price: PRODUCTS[0]!.price })
  for (let i = 0; i < 12; i++) await insertEvent(`demo-trend-bed-p${i}`, "product_view", daysAgo(randInt(7, 13)), "prod-1", { name: PRODUCTS[0]!.name, categorySlug: "beds", price: PRODUCTS[0]!.price })

  for (let i = 0; i < 15; i++) await insertEvent(`demo-trend-ward-r${i}`, "product_view", daysAgo(randInt(0, 6)), "prod-2", { name: PRODUCTS[1]!.name, categorySlug: "wardrobes", price: PRODUCTS[1]!.price })
  for (let i = 0; i < 16; i++) await insertEvent(`demo-trend-ward-p${i}`, "product_view", daysAgo(randInt(7, 13)), "prod-2", { name: PRODUCTS[1]!.name, categorySlug: "wardrobes", price: PRODUCTS[1]!.price })

  for (let i = 0; i < 6; i++) await insertEvent(`demo-trend-dt-r${i}`, "product_view", daysAgo(randInt(0, 6)), "prod-3", { name: PRODUCTS[2]!.name, categorySlug: "dressing-tables", price: PRODUCTS[2]!.price })
  for (let i = 0; i < 20; i++) await insertEvent(`demo-trend-dt-p${i}`, "product_view", daysAgo(randInt(7, 13)), "prod-3", { name: PRODUCTS[2]!.name, categorySlug: "dressing-tables", price: PRODUCTS[2]!.price })

  for (let i = 0; i < 18; i++) await insertEvent(`demo-trend-st-r${i}`, "product_view", daysAgo(randInt(0, 6)), "prod-4", { name: PRODUCTS[3]!.name, categorySlug: "side-tables", price: PRODUCTS[3]!.price })
  for (let i = 0; i < 9; i++) await insertEvent(`demo-trend-set-r${i}`, "product_view", daysAgo(randInt(0, 6)), "prod-5", { name: PRODUCTS[4]!.name, categorySlug: "bedroom-sets", price: PRODUCTS[4]!.price })

  // Search terms
  for (let i = 0; i < 90; i++) {
    const s = rand(SEARCH_TERMS)
    await insertEvent(`demo-search-${i}`, "search", dateInCurrentMonth(), undefined, { term: s.term, resultCount: s.resultCount })
  }

  // One bulk insert via unnest() instead of one round-trip per row.
  await sql`
    INSERT INTO events (session_id, event, product_id, meta, created_at)
    SELECT * FROM unnest(
      ${pendingEvents.map((e) => e.sessionId)}::text[],
      ${pendingEvents.map((e) => e.event)}::text[],
      ${pendingEvents.map((e) => e.productId)}::text[],
      ${pendingEvents.map((e) => e.meta)}::jsonb[],
      ${pendingEvents.map((e) => e.createdAt)}::timestamptz[]
    )
  `
  console.log(`  events: ${pendingEvents.length}`)

  // ── Leads (inquiry inbox) ───────────────────────────────────────────────
  const productSlugs = ["king-foam-bed-walnut", "3-door-wardrobe-walnut", "dressing-table-walnut", "side-table-pair-walnut", "full-bedroom-set-tier-3-walnut"]
  const leadMessages = [
    "Is this available in white finish?",
    "Do you deliver to Islamabad?",
    "What's the lead time for a custom size?",
    "Can I get a discount on bulk order for a guest house?",
    "Interested — please call me back",
    "Do you have this in queen size too?",
    "What's included in the price — mattress too?",
    null,
  ]
  const leadSources = ["contact_form", "product_page", "whatsapp"]
  let leadCount = 0
  for (let i = 0; i < 11; i++) {
    await sql`
      INSERT INTO leads (name, phone, product_slug, message, source, followed_up, created_at)
      VALUES (
        ${rand(CUSTOMER_NAMES)}, ${demoPhone(300 + i)}, ${rand(productSlugs)}, ${rand(leadMessages)},
        ${rand(leadSources)}, ${Math.random() < 0.4}, ${dateInCurrentMonth().toISOString()}
      )
    `
    leadCount++
  }
  console.log(`  leads: ${leadCount}`)

  console.log("Done. Run remove-dashboard-demo-data.ts to undo.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
