"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { jsPDF } from "jspdf"
import { X, Download, FileText, Loader2 } from "lucide-react"

interface CouponQrModalProps {
  code: string
  type: "percent" | "flat"
  value: number
  expiresAt: string | null
  onClose: () => void
}

const CANVAS_W = 1080
const CANVAS_H = 1350

export function CouponQrModal({ code, type, value, expiresAt, onClose }: CouponQrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/coupon/${code}` : ""

  useEffect(() => {
    let cancelled = false

    async function draw() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = CANVAS_W
      canvas.height = CANVAS_H

      // Background
      ctx.fillStyle = "#16352A"
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Gold rule
      ctx.fillStyle = "#C9A24B"
      ctx.fillRect(0, 64, CANVAS_W, 6)

      // Brand
      ctx.fillStyle = "#F2EEE6"
      ctx.font = "600 42px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Yousuf Living", CANVAS_W / 2, 150)

      ctx.fillStyle = "#C9A24B"
      ctx.font = "500 32px Arial"
      ctx.fillText(type === "percent" ? `${value}% OFF` : `Rs ${value} OFF`, CANVAS_W / 2, 210)

      // QR code
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 640,
        margin: 1,
        color: { dark: "#16352A", light: "#F2EEE6" },
      })
      const qrImg = new Image()
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve()
        qrImg.onerror = () => reject(new Error("QR image failed to load"))
        qrImg.src = qrDataUrl
      })
      if (cancelled) return
      const qrSize = 640
      ctx.drawImage(qrImg, (CANVAS_W - qrSize) / 2, 280, qrSize, qrSize)

      // Code
      ctx.fillStyle = "#F2EEE6"
      ctx.font = "700 56px monospace"
      ctx.fillText(code, CANVAS_W / 2, 1040)

      ctx.fillStyle = "#8A9A8E"
      ctx.font = "400 28px Arial"
      ctx.fillText("Scan to apply at checkout", CANVAS_W / 2, 1100)

      if (expiresAt) {
        ctx.fillStyle = "#D7DCD4"
        ctx.font = "400 26px Arial"
        ctx.fillText(`Valid until ${new Date(expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, CANVAS_W / 2, 1150)
      }

      if (!cancelled) setReady(true)
    }

    draw().catch((err) => setError(err.message ?? "Failed to generate QR code"))
    return () => { cancelled = true }
  }, [code, type, value, expiresAt, shareUrl])

  function downloadPng() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `coupon-${code}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  function downloadPdf() {
    const canvas = canvasRef.current
    if (!canvas) return
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [CANVAS_W, CANVAS_H] })
    pdf.addImage(imgData, "PNG", 0, 0, CANVAS_W, CANVAS_H)
    pdf.save(`coupon-${code}.pdf`)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4">
      <div className="w-full max-w-sm rounded-[16px] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading font-bold text-[15px] text-ink">Coupon QR — {code}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <p className="mb-3 text-[12px] text-error">{error}</p>}

        <div className="overflow-hidden rounded-[12px] border border-border bg-forest">
          <canvas ref={canvasRef} className="w-full" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }} />
        </div>

        <p className="mt-2 break-all font-mono text-[10.5px] text-sage">{shareUrl}</p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={downloadPng}
            disabled={!ready}
            className="flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-forest font-heading font-bold text-[12.5px] text-bone disabled:opacity-50"
          >
            {ready ? <Download className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />} PNG
          </button>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={!ready}
            className="flex min-h-[42px] flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-forest font-heading font-bold text-[12.5px] text-forest disabled:opacity-50"
          >
            {ready ? <FileText className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />} PDF
          </button>
        </div>
      </div>
    </div>
  )
}
