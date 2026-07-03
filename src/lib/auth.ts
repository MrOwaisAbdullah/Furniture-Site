import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./neon"
import { adminUsers, adminSessions, adminAccounts, adminVerifications } from "./neon/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user:         adminUsers,
      session:      adminSessions,
      account:      adminAccounts,
      verification: adminVerifications,
    },
  }),
  secret:  process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn:       60 * 60 * 24 * 7,  // 7 days
    updateAge:       60 * 60 * 24,       // extend on activity
    cookieCache: {
      enabled:   true,
      maxAge:    60 * 5,
    },
  },
})
