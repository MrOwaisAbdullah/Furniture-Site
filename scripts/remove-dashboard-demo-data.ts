/**
 * Removes exactly the data inserted by seed-dashboard-demo-data.ts — nothing
 * else. Matches on the same demo markers, deleted in FK-safe order (child
 * rows before the tables they reference).
 *
 * Run: node_modules/.bin/tsx scripts/remove-dashboard-demo-data.ts
 */
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  console.log("Removing demo data…")

  const redemptions = await sql`
    DELETE FROM coupon_redemptions WHERE order_ref LIKE 'YL-DEMO-%' RETURNING id
  `
  console.log(`  coupon_redemptions: ${redemptions.length}`)

  const payouts = await sql`
    DELETE FROM affiliate_payouts WHERE order_ref LIKE 'YL-DEMO-%' RETURNING id
  `
  console.log(`  affiliate_payouts: ${payouts.length}`)

  const orders = await sql`
    DELETE FROM orders WHERE ref LIKE 'YL-DEMO-%' RETURNING id
  `
  console.log(`  orders: ${orders.length}`)

  const events = await sql`
    DELETE FROM events WHERE session_id LIKE 'demo-%' RETURNING id
  `
  console.log(`  events: ${events.length}`)

  const coupons = await sql`
    DELETE FROM coupons WHERE code LIKE 'DEMO%' RETURNING id
  `
  console.log(`  coupons: ${coupons.length}`)

  const affiliates = await sql`
    DELETE FROM affiliates WHERE phone LIKE '03009%' RETURNING id
  `
  console.log(`  affiliates: ${affiliates.length}`)

  const leads = await sql`
    DELETE FROM leads WHERE phone LIKE '03009%' RETURNING id
  `
  console.log(`  leads: ${leads.length}`)

  console.log("Done — demo data removed, real data untouched.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
