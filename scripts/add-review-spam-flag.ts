/**
 * Adds the spam_flagged column to reviews. drizzle-kit generate can't run
 * non-interactively in this environment (it prompts to resolve a perceived
 * column rename), so this is a plain, idempotent ALTER TABLE instead —
 * same pattern as add-qa-and-addresses-tables.ts.
 * Usage: npm run tsx scripts/add-review-spam-flag.ts (or node_modules/.bin/tsx directly)
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  await sql`ALTER TABLE reviews ADD COLUMN IF NOT EXISTS spam_flagged BOOLEAN NOT NULL DEFAULT false`

  console.log("reviews.spam_flagged column ready.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
