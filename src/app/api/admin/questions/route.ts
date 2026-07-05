import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAllowedAdminSession } from "@/lib/admin-session"
import { answerQuestion } from "@/lib/neon/queries"

const schema = z.object({ id: z.number(), answer: z.string().min(1).max(1000) })

export async function PATCH(req: NextRequest) {
  const session = await getAllowedAdminSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  await answerQuestion(parsed.data.id, parsed.data.answer)
  return NextResponse.json({ ok: true })
}
