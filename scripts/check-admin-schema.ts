import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL)

  const users = await sql`SELECT id, email, name, email_verified FROM admin_users`
  console.log("Admin users:", JSON.stringify(users, null, 2))

  const accounts = await sql`SELECT id, account_id, provider_id, user_id, (password IS NOT NULL) as has_password FROM admin_accounts`
  console.log("Accounts:", JSON.stringify(accounts, null, 2))

  const verifications = await sql`SELECT id, identifier, value FROM admin_verifications`
  console.log("Verifications:", JSON.stringify(verifications, null, 2))
}

main().catch((e) => {
  console.error("ERROR:", e.message)
  process.exit(1)
})
