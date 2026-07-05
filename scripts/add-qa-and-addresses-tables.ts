/**
 * Creates product_questions and customer_addresses tables.
 * Usage: npm run tsx scripts/add-qa-and-addresses-tables.ts (or node_modules/.bin/tsx directly)
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  await sql`
    CREATE TABLE IF NOT EXISTS product_questions (
      id SERIAL PRIMARY KEY,
      product_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT,
      answered_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS product_questions_product_idx ON product_questions (product_slug)`

  await sql`
    CREATE TABLE IF NOT EXISTS customer_addresses (
      id SERIAL PRIMARY KEY,
      phone TEXT NOT NULL,
      label TEXT NOT NULL DEFAULT 'Home',
      area TEXT,
      address TEXT NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS customer_addresses_phone_idx ON customer_addresses (phone)`

  console.log("product_questions and customer_addresses tables ready.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
