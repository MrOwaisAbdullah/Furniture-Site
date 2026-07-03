import { NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { orders } from "@/lib/neon/schema"
import { eq, and, lte } from "drizzle-orm"

// Archives delivered orders older than 30 days — intended to run as a cron job
export async function POST() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const result = await db.update(orders)
    .set({ status: "archived" })
    .where(
      and(
        eq(orders.status, "delivered"),
        lte(orders.updatedAt, thirtyDaysAgo)
      )
    )
    .returning({ ref: orders.ref })

  return NextResponse.json({ archived: result.length })
}
