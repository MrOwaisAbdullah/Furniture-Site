import { NextRequest, NextResponse } from "next/server"
import { createPresignedUploadUrl, getPublicUrl, paymentScreenshotKey } from "@/lib/r2"

export async function POST(req: NextRequest) {
  try {
    const { orderRef, fileName } = await req.json()

    if (!orderRef || !fileName) {
      return NextResponse.json({ error: "orderRef and fileName are required" }, { status: 400 })
    }

    const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg"
    const allowedExts = ["jpg", "jpeg", "png", "pdf"]
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ error: "Only JPG, PNG, and PDF files are allowed" }, { status: 400 })
    }

    const key = paymentScreenshotKey(orderRef, ext)
    const contentType = ext === "pdf" ? "application/pdf" : `image/${ext === "jpg" ? "jpeg" : ext}`
    const uploadUrl = await createPresignedUploadUrl(key, contentType)
    const publicUrl = getPublicUrl(key)

    return NextResponse.json({ uploadUrl, publicUrl, key })
  } catch (err) {
    console.error("[upload] error", err)
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 })
  }
}
