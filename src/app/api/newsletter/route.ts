import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { addEmailSubscriber } from "@/lib/neon/queries"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    await addEmailSubscriber(parsed.data.email, "footer")

    return NextResponse.json({ ok: true, message: "Subscribed!" })
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
