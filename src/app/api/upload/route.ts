import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createPresignedUploadUrl, paymentScreenshotKey } from "@/lib/r2"

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "application/pdf": "pdf",
}
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const schema = z.object({
  orderRef:    z.string().min(1),
  contentType: z.string(),
  byteSize:    z.number().int().min(1),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { orderRef, contentType, byteSize } = parsed.data

  const ext = ALLOWED_TYPES[contentType]
  if (!ext) {
    return NextResponse.json({ error: "File type not allowed. JPG, PNG, or PDF only." }, { status: 400 })
  }
  if (byteSize > MAX_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum 5 MB." }, { status: 400 })
  }

  const key = paymentScreenshotKey(orderRef, ext)
  const presignedUrl = await createPresignedUploadUrl(key, contentType)

  return NextResponse.json({ presignedUrl, key })
}
