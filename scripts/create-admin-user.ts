/**
 * One-off script to create (or reset the password for) the single admin
 * account BetterAuth uses. There is no public sign-up route by design —
 * admin access is a single owner account gated by ALLOWED_ADMIN_EMAIL.
 *
 * Usage:
 *   npm run admin:create-user -- --email owner@example.com --password "..." --name "Owner"
 *
 * If that email already has an account, re-run with --reset to delete the
 * existing user (and its cascaded sessions/credentials) and recreate it
 * with the new password. Safe for this app specifically: nothing else in
 * the database references the admin user row, since it's a single-owner
 * account, not a multi-user system.
 */
import { config } from "dotenv"
import { resolve } from "path"
const envPath = resolve(process.cwd(), ".env.local")
config({ path: envPath })

if (!process.env.DATABASE_URL) {
  console.error(
    `DATABASE_URL is not set after loading ${envPath}.\n` +
    `Check that the file exists at that exact path and contains a line like:\n` +
    `  DATABASE_URL=postgresql://...\n` +
    `(no quotes, no "export", the key spelled exactly DATABASE_URL).`
  )
  process.exit(1)
}

import { auth } from "../src/lib/auth"
import { db } from "../src/lib/neon"
import { adminUsers } from "../src/lib/neon/schema"
import { eq } from "drizzle-orm"

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

async function main() {
  const email = arg("email") ?? process.env.ALLOWED_ADMIN_EMAIL
  const password = arg("password")
  const name = arg("name") ?? "Admin"
  const reset = hasFlag("reset")

  if (!email || !password) {
    console.error("Usage: npm run admin:create-user -- --email you@example.com --password \"...\" [--name \"Owner\"] [--reset]")
    process.exit(1)
  }

  if (process.env.ALLOWED_ADMIN_EMAIL && email.toLowerCase() !== process.env.ALLOWED_ADMIN_EMAIL.toLowerCase()) {
    console.error(
      `Warning: ${email} does not match ALLOWED_ADMIN_EMAIL (${process.env.ALLOWED_ADMIN_EMAIL}). ` +
      `This account will be created but will be rejected at login until the allowlist matches.`
    )
  }

  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)
  if (existing.length > 0) {
    if (!reset) {
      console.error(`An admin user with email ${email} already exists. Re-run with --reset to delete and recreate it with the new password.`)
      process.exit(1)
    }
    await db.delete(adminUsers).where(eq(adminUsers.email, email))
    console.log(`Existing admin user deleted (cascaded sessions/credentials removed).`)
  }

  const result = await auth.api.signUpEmail({ body: { email, password, name } })
  if (!result) {
    console.error("Failed to create admin user.")
    process.exit(1)
  }

  console.log(`Admin user created: ${email}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
