import { jsPDF } from "jspdf"
import { formatPrice } from "@/lib/utils"
import { BUSINESS_NAME, ADDRESS_FULL, PHONE_DISPLAY, EMAIL_ORDERS } from "@/lib/site-config"

export interface ReceiptOrder {
  ref: string
  customerName: string
  customerPhone: string
  items: { name: string; price: number; qty: number; finishName?: string }[]
  subtotal: number
  discount: number
  advance: number
  total: number
  paymentMethod: string
  deliveryMethod: string
  deliveryArea?: string | null
  createdAt: string | Date
}

/** Text-based PDF receipt — no canvas, just jsPDF's own layout primitives,
 * since this is tabular/textual data rather than a branded share-image. */
export function downloadReceipt(order: ReceiptOrder) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" })
  const marginX = 48
  let y = 56

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(18)
  pdf.text(BUSINESS_NAME, marginX, y)

  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(9)
  pdf.setTextColor(90, 100, 96)
  y += 16
  pdf.text(ADDRESS_FULL, marginX, y)
  y += 12
  pdf.text(`${PHONE_DISPLAY} · ${EMAIL_ORDERS}`, marginX, y)

  pdf.setDrawColor(201, 162, 75)
  pdf.setLineWidth(1.5)
  y += 14
  pdf.line(marginX, y, 548, y)

  y += 28
  pdf.setTextColor(20, 30, 26)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(13)
  pdf.text("Order Receipt", marginX, y)

  y += 20
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(10)
  const createdAt = new Date(order.createdAt)
  const rows: [string, string][] = [
    ["Order ref", order.ref],
    ["Date", createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
    ["Customer", order.customerName],
    ["Phone", order.customerPhone],
    ["Delivery", order.deliveryMethod === "showroom" ? "Showroom collection" : `Delivery${order.deliveryArea ? ` — ${order.deliveryArea}` : ""}`],
    ["Payment method", order.paymentMethod],
  ]
  for (const [label, value] of rows) {
    pdf.setTextColor(90, 100, 96)
    pdf.text(label, marginX, y)
    pdf.setTextColor(20, 30, 26)
    pdf.text(value, marginX + 110, y)
    y += 16
  }

  y += 12
  pdf.setDrawColor(228, 224, 214)
  pdf.setLineWidth(1)
  pdf.line(marginX, y, 548, y)
  y += 20

  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(10)
  pdf.text("Item", marginX, y)
  pdf.text("Qty", 380, y, { align: "right" })
  pdf.text("Amount", 548, y, { align: "right" })
  y += 8
  pdf.setDrawColor(228, 224, 214)
  pdf.line(marginX, y, 548, y)
  y += 18

  pdf.setFont("helvetica", "normal")
  for (const item of order.items) {
    const label = item.finishName ? `${item.name} (${item.finishName})` : item.name
    pdf.text(label, marginX, y, { maxWidth: 300 })
    pdf.text(String(item.qty), 380, y, { align: "right" })
    pdf.text(formatPrice(item.price * item.qty), 548, y, { align: "right" })
    y += 18
  }

  y += 6
  pdf.line(marginX, y, 548, y)
  y += 20

  const totals: [string, number, boolean][] = [
    ["Subtotal", order.subtotal, false],
    ["Discount", -order.discount, false],
    ["Total", order.total, true],
    ["Advance paid", order.advance, false],
    ["Balance on delivery", order.total - order.advance, true],
  ]
  for (const [label, value, bold] of totals) {
    if (label === "Discount" && order.discount === 0) continue
    pdf.setFont("helvetica", bold ? "bold" : "normal")
    pdf.setTextColor(bold ? 22 : 90, bold ? 53 : 100, bold ? 42 : 96)
    pdf.text(label, 380, y)
    pdf.text(formatPrice(value), 548, y, { align: "right" })
    y += 16
  }

  y += 24
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(9)
  pdf.setTextColor(140, 140, 140)
  pdf.text("Thank you for choosing " + BUSINESS_NAME + ". This receipt confirms your order and advance payment.", marginX, y, { maxWidth: 500 })

  pdf.save(`${order.ref}-receipt.pdf`)
}
