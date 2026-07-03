import { NextResponse } from "next/server"
import { db } from "@/lib/neon"
import { sql } from "drizzle-orm"

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
