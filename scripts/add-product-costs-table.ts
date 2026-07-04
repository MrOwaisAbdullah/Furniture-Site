/**
 * Manual migration (drizzle-kit's bundled esbuild is currently broken in
 * this environment) — adds the product_costs table used by the cost sheet's
 * general/product-specific fallback. Idempotent.
 */
import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  await sql`
    CREATE TABLE IF NOT EXISTS product_costs (
      id serial PRIMARY KEY,
      product_slug text NOT NULL UNIQUE,
      category_slug text NOT NULL,
      board decimal(10,2) NOT NULL DEFAULT 0,
      foam decimal(10,2) NOT NULL DEFAULT 0,
      rexine decimal(10,2) NOT NULL DEFAULT 0,
      hardware decimal(10,2) NOT NULL DEFAULT 0,
      labour decimal(10,2) NOT NULL DEFAULT 0,
      deco decimal(10,2) NOT NULL DEFAULT 0,
      wastage decimal(10,2) NOT NULL DEFAULT 0,
      margin_pct decimal(5,2) NOT NULL DEFAULT 40,
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `

  console.log("product_costs table ready.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
