import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { generateSummary } from "@/lib/ai-summary"

const schema = z.object({
  type: z.enum(["pnl", "funnel", "affiliate"]),
  data: z.record(z.string(), z.unknown()),
})

export async function POST(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const summary = await generateSummary(parsed.data.type, parsed.data.data)
  return NextResponse.json({ summary })
}
