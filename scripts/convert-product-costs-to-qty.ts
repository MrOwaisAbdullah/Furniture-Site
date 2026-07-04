/**
 * Manual migration — converts product_costs material columns (board, foam,
 * rexine, patex) from flat PKR amounts to quantities that multiply against
 * the shared material_rates. Table is new/empty in practice, so this drops
 * and recreates the affected columns rather than trying to convert values.
 */
import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  await sql`ALTER TABLE product_costs DROP COLUMN IF EXISTS board`
  await sql`ALTER TABLE product_costs DROP COLUMN IF EXISTS foam`
  await sql`ALTER TABLE product_costs DROP COLUMN IF EXISTS rexine`
  await sql`ALTER TABLE product_costs DROP COLUMN IF EXISTS patex`

  await sql`ALTER TABLE product_costs ADD COLUMN IF NOT EXISTS board_qty decimal(6,2) NOT NULL DEFAULT 0`
  await sql`ALTER TABLE product_costs ADD COLUMN IF NOT EXISTS foam_qty decimal(6,2) NOT NULL DEFAULT 0`
  await sql`ALTER TABLE product_costs ADD COLUMN IF NOT EXISTS rexine_qty decimal(6,2) NOT NULL DEFAULT 0`
  await sql`ALTER TABLE product_costs ADD COLUMN IF NOT EXISTS patex_qty decimal(6,2) NOT NULL DEFAULT 0`

  console.log("product_costs converted to quantity-based material columns.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
