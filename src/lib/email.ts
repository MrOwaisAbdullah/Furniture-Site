import { Resend } from "resend"
import { BUSINESS_NAME, EMAIL_ORDERS } from "@/lib/site-config"

// Lazily instantiated — the Resend SDK throws in its constructor if the key
// is empty/missing, which would otherwise crash module load (and therefore
// the whole build) for every route that imports this file, even before an
// email is ever sent.
let _resend: Resend | null = null
export function resend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM = `${BUSINESS_NAME} <${EMAIL_ORDERS}>`

// ── Order confirmation ────────────────────────────────────────────────────────

export async function sendOrderConfirmation(opts: {
  to: string
  orderRef: string
  customerName: string
  items: { name: string; qty: number; price: number }[]
  total: number
  advance: number
  deliveryMethod: string
}) {
  const itemRows = opts.items
    .map((i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td>Rs ${i.price.toLocaleString()}</td></tr>`)
    .join("")

  return resend().emails.send({
    from:    FROM,
    to:      opts.to,
    subject: `Order Confirmed — ${opts.orderRef} | ${BUSINESS_NAME}`,
    html: `
      <h2>Thanks for your order, ${opts.customerName}!</h2>
      <p>Your order reference: <strong>${opts.orderRef}</strong></p>
      <table border="1" cellpadding="8">
        <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        ${itemRows}
      </table>
      <p>Total: <strong>Rs ${opts.total.toLocaleString()}</strong></p>
      <p>Advance paid: <strong>Rs ${opts.advance.toLocaleString()}</strong></p>
      <p>Delivery: ${opts.deliveryMethod === "showroom" ? "Showroom collection" : "Karachi delivery"}</p>
      <p>We'll WhatsApp you within 2 hours to confirm your build slot.</p>
      <p>— ${BUSINESS_NAME} Team</p>
    `,
  })
}

// ── Thank-you + referral code (5-7 days after delivery) ──────────────────────

export async function sendThankYouEmail(opts: {
  to: string
  customerName: string
  referralCode: string
}) {
  return resend().emails.send({
    from:    FROM,
    to:      opts.to,
    subject: "Thank you — here's your referral code 🎁",
    html: `
      <h2>Thank you, ${opts.customerName}!</h2>
      <p>We hope you're loving your new furniture.</p>
      <p>Share your referral code with friends — they get <strong>5% off</strong> their first order:</p>
      <h3 style="font-size:28px;letter-spacing:4px;">${opts.referralCode}</h3>
      <p>You earn a commission every time someone orders using your code.</p>
      <p>— ${BUSINESS_NAME} Team</p>
    `,
  })
}

// ── One-time login codes (affiliate dashboard, customer account) ─────────────

export async function sendOtpEmail(opts: { to: string; otp: string; purpose: "affiliate" | "account" }) {
  const heading = opts.purpose === "affiliate" ? "Your affiliate dashboard code" : "Your account login code"

  // Dev/preview convenience — without RESEND_API_KEY configured, emails
  // silently fail (by design, see resend() above). Log the code so local
  // and preview testing doesn't require real email delivery.
  if (!process.env.RESEND_API_KEY) {
    console.log(`[dev-otp] ${opts.purpose} code for ${opts.to}: ${opts.otp}`)
    return null
  }

  return resend().emails.send({
    from:    FROM,
    to:      opts.to,
    subject: `${opts.otp} — ${heading} | ${BUSINESS_NAME}`,
    html: `
      <h2>${heading}</h2>
      <p>Enter this code to continue:</p>
      <h3 style="font-size:32px;letter-spacing:6px;">${opts.otp}</h3>
      <p>This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>
      <p>— ${BUSINESS_NAME} Team</p>
    `,
  })
}

// ── Back-in-stock notification ────────────────────────────────────────────────

export async function sendBackInStockEmail(opts: {
  to: string
  productName: string
  productUrl: string
}) {
  return resend().emails.send({
    from:    FROM,
    to:      opts.to,
    subject: `Back in stock: ${opts.productName} | ${BUSINESS_NAME}`,
    html: `
      <h2>${opts.productName} is back!</h2>
      <p>You asked us to let you know — it's available again.</p>
      <a href="${opts.productUrl}" style="background:#16352A;color:#F2EEE6;padding:12px 24px;text-decoration:none;border-radius:8px;">View Product</a>
      <p>— ${BUSINESS_NAME} Team</p>
    `,
  })
}
