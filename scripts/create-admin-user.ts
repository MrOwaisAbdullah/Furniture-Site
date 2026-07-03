/**
 * One-off script to create (or reset the password for) the single admin
 * account BetterAuth uses. There is no public sign-up route by design —
 * admin access is a single owner account gated by ALLOWED_ADMIN_EMAIL.
 *
 * Usage:
 *   npm run admin:create-user -- --email owner@example.com --password "..." --name "Owner"
 */
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { auth } from "../src/lib/auth"
import { db } from "../src/lib/neon"
import { adminUsers } from "../src/lib/neon/schema"
import { eq } from "drizzle-orm"

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

async function main() {
  const email = arg("email") ?? process.env.ALLOWED_ADMIN_EMAIL
  const password = arg("password")
  const name = arg("name") ?? "Admin"

  if (!email || !password) {
    console.error("Usage: npm run admin:create-user -- --email you@example.com --password \"...\" [--name \"Owner\"]")
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
    console.error(`An admin user with email ${email} already exists. Use the BetterAuth password-reset flow to change it.`)
    process.exit(1)
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
