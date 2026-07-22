import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

const ADMIN_PATHS = ["/admin"]
// Sanity Studio has its own separate login — don't also gate it behind the
// site's admin session cookie.
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/content-studio"]

// Cheap, edge-safe gate: confirms a well-formed session cookie exists.
// This does NOT validate the session against the DB or check the admin
// email allowlist — that authoritative check happens server-side in
// src/app/admin/(protected)/layout.tsx, which every protected admin page
// renders through.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Forward the current pathname so the root layout can decide whether to
  // render the customer-facing chrome (Header/Footer/MobileStickyBar) —
  // admin routes get their own shell instead.
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", pathname)

  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p))
  const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))

  if (isAdmin && !isPublic) {
    const sessionCookie = getSessionCookie(req)
    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)"],
}
