/**
 * Creates all BetterAuth admin tables from scratch.
 * Idempotent — safe to re-run (uses IF NOT EXISTS).
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      email_verified boolean NOT NULL DEFAULT false,
      name text NOT NULL,
      image text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id text PRIMARY KEY,
      token text NOT NULL UNIQUE,
      user_id text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      expires_at timestamp NOT NULL,
      ip_address text,
      user_agent text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS admin_accounts (
      id text PRIMARY KEY,
      account_id text NOT NULL,
      provider_id text NOT NULL,
      user_id text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      access_token text,
      refresh_token text,
      id_token text,
      access_token_expires_at timestamp,
      refresh_token_expires_at timestamp,
      scope text,
      password text,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS admin_verifications (
      id text PRIMARY KEY,
      identifier text NOT NULL,
      value text NOT NULL,
      expires_at timestamp NOT NULL,
      created_at timestamp NOT NULL DEFAULT now(),
      updated_at timestamp NOT NULL DEFAULT now()
    )
  `

  console.log("BetterAuth admin tables created successfully.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
