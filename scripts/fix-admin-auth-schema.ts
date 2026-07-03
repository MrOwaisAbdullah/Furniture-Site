/**
 * One-off manual migration to correct the BetterAuth admin tables.
 * Written as raw SQL (not drizzle-kit) because drizzle-kit's bundled esbuild
 * is currently broken in this environment — see conversation history.
 * Safe to re-run: every statement is idempotent (IF NOT EXISTS / guarded).
 */
import { neon } from "@neondatabase/serverless"

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS image text`
  await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now()`
  await sql`ALTER TABLE admin_users DROP COLUMN IF EXISTS password_hash`

  await sql`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS ip_address text`
  await sql`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS user_agent text`
  await sql`ALTER TABLE admin_sessions ADD COLUMN IF NOT EXISTS updated_at timestamp NOT NULL DEFAULT now()`

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

  console.log("Admin auth schema fixed.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
