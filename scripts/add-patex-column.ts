/**
 * Manual migration — adds the patex/sunmica laminate sheet cost column to
 * product_costs. Only some items use it, defaults to 0. Idempotent.
 */
import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)
  await sql`ALTER TABLE product_costs ADD COLUMN IF NOT EXISTS patex decimal(10,2) NOT NULL DEFAULT 0`
  console.log("patex column ready.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
