import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  const users = await sql`SELECT * FROM admin_users`
  console.log("USERS:", JSON.stringify(users, null, 2))

  const accounts = await sql`SELECT id, provider_id, substring(password from 1 for 30) as pw_prefix, length(password) as pw_len FROM admin_accounts`
  console.log("ACCOUNTS:", JSON.stringify(accounts, null, 2))
}

main()
