import { Redis } from "@upstash/redis"

export const redis = Redis.fromEnv()

// TTL constants (seconds)
export const TTL = {
  session:       60 * 60 * 24 * 7,   // 7 days
  cart:          60 * 60 * 24 * 7,   // 7 days
  otp:           60 * 5,              // 5 min
  stockCache:    60 * 10,             // 10 min
  viewerCounter: 60,                  // 60 s
  recentOrder:   60 * 60 * 48,        // 48 h
  rateLimitHour: 60 * 60,             // 1 hour window
}

// ── Cart ──────────────────────────────────────────────────────────────────────

export async function getCart(sessionId: string) {
  return redis.get<unknown[]>(`cart:${sessionId}`)
}

export async function setCart(sessionId: string, items: unknown[]) {
  return redis.setex(`cart:${sessionId}`, TTL.cart, items)
}

// ── OTP ───────────────────────────────────────────────────────────────────────

export async function storeOtp(phone: string, otp: string) {
  return redis.setex(`otp:${phone}`, TTL.otp, otp)
}

export async function verifyAndConsumeOtp(phone: string, otp: string): Promise<boolean> {
  const stored = await redis.get<string>(`otp:${phone}`)
  if (stored !== otp) return false
  await redis.del(`otp:${phone}`)
  return true
}

// ── Viewer counter (social proof) ─────────────────────────────────────────────

export async function incrementViewer(productId: string) {
  const key = `viewers:${productId}`
  await redis.incr(key)
  await redis.expire(key, TTL.viewerCounter)
  return redis.get<number>(key)
}

export async function decrementViewer(productId: string) {
  const key = `viewers:${productId}`
  return redis.decr(key)
}

export async function getViewerCount(productId: string) {
  return (await redis.get<number>(`viewers:${productId}`)) ?? 0
}

// ── Recent order ticker ────────────────────────────────────────────────────────

export async function pushRecentOrder(productId: string, meta: { name: string; area: string; hoursAgo: number }) {
  const key = `recent_order:${productId}`
  await redis.lpush(key, JSON.stringify(meta))
  await redis.ltrim(key, 0, 4)
  await redis.expire(key, TTL.recentOrder)
}

export async function getRecentOrders(productId: string) {
  const items = await redis.lrange<string>(`recent_order:${productId}`, 0, 4)
  return items.map((i) => (typeof i === "string" ? JSON.parse(i) : i))
}

// ── Rate limiting ─────────────────────────────────────────────────────────────

export async function checkCouponRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rl:coupon:${ip}`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, TTL.rateLimitHour)
  const allowed = count <= 10
  return { allowed, remaining: Math.max(0, 10 - count) }
}

export async function checkOtpRateLimit(phone: string): Promise<{ allowed: boolean }> {
  const key = `rl:otp:${phone}`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 60 * 15)
  return { allowed: count <= 3 }
}

// ── Lightweight portal sessions (affiliate + customer account) ────────────────
// Separate from BetterAuth — these are low-stakes, OTP-verified self-service
// sessions scoped to one affiliate/customer record, not the admin panel.

const PORTAL_SESSION_TTL = 60 * 60 * 24 * 7 // 7 days

export async function createPortalSession(namespace: "affiliate" | "account", subjectId: string, token: string) {
  return redis.setex(`portal_session:${namespace}:${token}`, PORTAL_SESSION_TTL, subjectId)
}

export async function getPortalSession(namespace: "affiliate" | "account", token: string): Promise<string | null> {
  return redis.get<string>(`portal_session:${namespace}:${token}`)
}
