import "server-only"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

/**
 * Authoritative admin session check. Beyond validating the session against
 * the DB, this enforces the single-owner email allowlist — a valid
 * BetterAuth session is not enough on its own, the session's email must
 * also match ALLOWED_ADMIN_EMAIL. Used by the admin layout (page render)
 * and by admin API routes (mutations).
 */
export async function getAllowedAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null

  const allowedEmail = process.env.ALLOWED_ADMIN_EMAIL
  if (!allowedEmail || session.user.email.toLowerCase() !== allowedEmail.toLowerCase()) {
    // Session is real but not the allowed owner — invalidate it so the
    // cookie can't be reused, and treat as unauthenticated.
    await auth.api.signOut({ headers: await headers() }).catch(() => {})
    return null
  }

  return session
}
