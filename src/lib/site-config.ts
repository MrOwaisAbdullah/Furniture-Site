/**
 * Single source of truth for contact details, address, and social links.
 * Never hardcode a phone number, email, or address elsewhere — import from
 * here so every page stays in sync when any of these change.
 */

export const BUSINESS_NAME = "Yousuf Living"

// ── Phone / WhatsApp ────────────────────────────────────────────────────────
// Canonical digits-only form (country code + number, no symbols) — the only
// format wa.me and tel: links accept reliably.
export const WHATSAPP_NUMBER = "923001234567"
export const PHONE_TEL = `+${WHATSAPP_NUMBER}`
export const PHONE_DISPLAY = "+92 300 1234567"
// schema.org/JSON-LD convention prefers dash-separated E.164
export const PHONE_STRUCTURED = "+92-300-1234567"
export const EASYPAISA_ACCOUNT_NUMBER = "0300-1234567"
export const EASYPAISA_ACCOUNT_NAME = BUSINESS_NAME
export const BANK_NAME = "Meezan Bank"
export const BANK_ACCOUNT_TITLE = BUSINESS_NAME
export const BANK_ACCOUNT_NUMBER = "0123 4567 8901 234"
export const BANK_IBAN = "PK12MEZN0001234567890"

export function waLink(message?: string): string {
  return message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`
}

// ── Email ────────────────────────────────────────────────────────────────────
export const EMAIL_ORDERS = "orders@yousufliving.pk"
export const EMAIL_ADMIN = "admin@yousufliving.pk"

// ── Address ──────────────────────────────────────────────────────────────────
export const ADDRESS_STREET = "Main road, Near Byco Petrol Pump, Manzoor Colony"
export const ADDRESS_CITY = "Karachi"
export const ADDRESS_REGION = "Sindh"
export const ADDRESS_POSTAL_CODE = "75400"
export const ADDRESS_COUNTRY = "PK"
export const ADDRESS_FULL = `${ADDRESS_STREET}, ${ADDRESS_CITY}`
export const SHOWROOM_LAT = 24.8607
export const SHOWROOM_LNG = 67.0011

// ── Social ───────────────────────────────────────────────────────────────────
export const SOCIAL_INSTAGRAM = "https://instagram.com/yousufliving"
export const SOCIAL_FACEBOOK = "https://facebook.com/yousufliving"
export const SOCIAL_TIKTOK = "https://tiktok.com/@yousufliving"
