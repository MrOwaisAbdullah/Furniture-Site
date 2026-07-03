import { NextResponse } from "next/server"
import { getAllowedAdminSession } from "@/lib/admin-session"

// Called right after a BetterAuth sign-in to confirm the session's email
// matches ALLOWED_ADMIN_EMAIL. A valid session alone is not enough — this
// panel is restricted to a single owner account.
export async function GET() {
  const session = await getAllowedAdminSession()
  if (!session) {
    return NextResponse.json({ authorized: false }, { status: 403 })
  }
  return NextResponse.json({ authorized: true, email: session.user.email })
}
