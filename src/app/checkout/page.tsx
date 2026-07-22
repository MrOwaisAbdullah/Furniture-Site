"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { useToast } from "@/components/ui/toast"
import { StepDetails, type DetailsForm } from "@/components/checkout/step-details"
import { StepDelivery, type DeliveryMode } from "@/components/checkout/step-delivery"
import { StepConfirm } from "@/components/checkout/step-confirm"
import { StepPayment, type PaymentMethod } from "@/components/checkout/step-payment"
import { OrderSummarySidebar } from "@/components/checkout/order-summary-sidebar"
import { CheckoutUpsellModal } from "@/components/checkout/checkout-upsell-modal"
import { trackEvent } from "@/lib/track-event"
import { getCheckoutUpsells } from "@/lib/recommendations"
import { computeCartSetDiscount } from "@/lib/set-bundle"
import type { Product } from "@/types"

const STEP_LABELS = ["Your details", "Delivery", "Review & advance", "Payment"]
const STEP_KEYS = ["details", "delivery", "review", "payment"]

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match?.[1] ? decodeURIComponent(match[1]) : undefined
}

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<DetailsForm>({ name: "", phone: "", area: "", address: "" })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof DetailsForm, string>>>({})
  const [delivery, setDelivery] = useState<DeliveryMode>("deliver")
  const [payment, setPayment] = useState<PaymentMethod>("bank")
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null)

  const { toast } = useToast()
  const { items, totalPrice, clearCart, addItem } = useCartStore()

  const startedTracking = useRef(false)
  useEffect(() => {
    if (startedTracking.current || items.length === 0) return
    startedTracking.current = true
    trackEvent("checkout_started", { itemCount: items.length, subtotal: totalPrice })
  }, [items.length, totalPrice])

  const [productPool, setProductPool] = useState<Product[]>([])
  useEffect(() => {
    fetch("/api/products/all")
      .then((r) => r.json())
      .then((data) => { if (data.products) setProductPool(data.products) })
      .catch(() => {})
  }, [])

  const cartProductIds = items.map((i) => i.productId).join(",")
  const cartKey = items.map((i) => `${i.productId}:${i.quantity}`).join(",")

  const upsellSuggestions = useMemo(
    () => getCheckoutUpsells(items, productPool, 3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartProductIds, productPool]
  )

  // Recomputed live from whatever is actually in the cart — never a
  // snapshot taken at add-to-cart time, so removing/adding a matching
  // piece here adjusts the discount automatically.
  const autoSetDiscount = useMemo(
    () => computeCartSetDiscount(items, productPool),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cartKey, productPool]
  )
  const effectiveDiscount = autoSetDiscount && autoSetDiscount.amount > discount ? autoSetDiscount.amount : discount
  const finalTotal = Math.max(0, totalPrice - effectiveDiscount)
  const advance = Math.round(finalTotal / 2)
  const [showUpsell, setShowUpsell] = useState(false)

  useEffect(() => {
    if (items.length === 0 || upsellSuggestions.length === 0) return
    if (sessionStorage.getItem("yl_checkout_upsell_seen")) return
    const timer = setTimeout(() => {
      setShowUpsell(true)
      trackEvent("checkout_upsell_shown", { productIds: upsellSuggestions.map((p) => p._id) })
    }, 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, upsellSuggestions])

  function dismissUpsell() {
    sessionStorage.setItem("yl_checkout_upsell_seen", "1")
    setShowUpsell(false)
    trackEvent("checkout_upsell_dismissed", {})
  }

  function addUpsellProduct(product: Product) {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.salePrice ?? product.basePrice,
      variantId: product.variants[0]?._id,
      finishId: product.finishes[0]?._id,
      finishName: product.finishes[0]?.name,
    })
    trackEvent("checkout_upsell_added", { productId: product._id, name: product.name, price: product.salePrice ?? product.basePrice })
  }

  function validateStep(): boolean {
    const errs: Partial<Record<keyof DetailsForm, string>> = {}
    if (step === 0) {
      if (!form.name.trim()) errs.name = "Name is required"
      if (!form.phone.trim()) errs.phone = "Phone number is required"
      else if (!/^(\+92|0)?3\d{9}$/.test(form.phone.replace(/\s/g, "")))
        errs.phone = "Enter a valid Pakistan mobile number"
      if (!form.area) errs.area = "Select your area"
      if (!form.address.trim()) errs.address = "Address is required"
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  function goToStep(next: number) {
    if (!validateStep()) return
    trackEvent("checkout_step_completed", { step: STEP_KEYS[step] })
    setStep(next)
  }

  function handleChange(next: Partial<DetailsForm>) {
    setForm((prev) => ({ ...prev, ...next }))
    if (Object.keys(formErrors).length > 0) {
      setFormErrors({})
    }
  }

  async function uploadScreenshot(orderRef: string): Promise<string | null> {
    if (!screenshotFile) return null

    try {
      // Get presigned URL
      const presignRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderRef, fileName: screenshotFile.name }),
      })
      const presignData = await presignRes.json()

      if (!presignRes.ok || !presignData.uploadUrl) {
        console.error("[upload] Failed to get presigned URL")
        return null
      }

      // Upload file to R2
      const uploadRes = await fetch(presignData.uploadUrl, {
        method: "PUT",
        body: screenshotFile,
        headers: { "Content-Type": screenshotFile.type },
      })

      if (!uploadRes.ok) {
        console.error("[upload] Failed to upload to R2")
        return null
      }

      return presignData.publicUrl as string
    } catch (err) {
      console.error("[upload] Error:", err)
      return null
    }
  }

  async function submitOrder() {
    setSubmitting(true)
    setError(null)

    const promoCode = readCookie("promo_code")

    // First, create the order without screenshot
    const payload = {
      customerName: form.name,
      customerPhone: form.phone,
      deliveryArea: form.area || undefined,
      deliveryAddress: form.address || undefined,
      deliveryMethod: delivery === "deliver" ? "delivery" as const : "showroom" as const,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        qty: i.quantity,
        variantId: i.variantId,
        finishId: i.finishId,
        finishName: i.finishName,
      })),
      subtotal: totalPrice,
      discount: effectiveDiscount,
      advance,
      paymentMethod: payment,
      couponCode: appliedCouponCode ?? promoCode,
      affiliateCode: promoCode,
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = await res.json()

      if (!res.ok) {
        setError(body?.error ?? "Something went wrong — please check your details and try again.")
        setSubmitting(false)
        return
      }

      // Upload screenshot if selected (non-blocking)
      if (screenshotFile && body.ref) {
        uploadScreenshot(body.ref).catch(() => {
          // Screenshot upload failed, but order is already created
          // Admin can still follow up via WhatsApp
        })
      }

      trackEvent("order_completed", { orderRef: body.ref, total: totalPrice, itemCount: items.length })
      sessionStorage.setItem("yl_last_order", JSON.stringify({ ref: body.ref, advance }))
      clearCart()
      toast("Booking confirmed! Check your WhatsApp for updates.", "success")
      router.push("/checkout/confirmation")
    } catch {
      setError("Network error — please try again.")
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest/8">
          <ShoppingBag className="h-7 w-7 stroke-forest/50" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-heading font-bold text-[18px] text-ink">Your cart is empty</p>
          <p className="mt-1.5 text-[13px] text-slate">Add pieces from the shop to get started.</p>
        </div>
        <Link
          href="/shop"
          className="mt-2 rounded-[10px] bg-forest px-6 py-3 font-heading font-bold text-[14px] text-bone"
        >
          Browse sets
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-10">
        {/* Mobile order summary — sticky bar at the very top, above everything */}
        <OrderSummarySidebar
          items={items}
          totalPrice={totalPrice}
          advance={advance}
          discount={discount}
          appliedCode={appliedCouponCode}
          onApplyCoupon={(amt, code) => { setDiscount(amt); setAppliedCouponCode(code) }}
          onRemoveCoupon={() => { setDiscount(0); setAppliedCouponCode(null) }}
          autoSetDiscount={autoSetDiscount}
        />

        <div className="max-w-xl lg:order-1 lg:max-w-none">
          {/* Progress bar */}
          <div className="mb-5 mt-5 flex gap-2 lg:mt-0">
            {STEP_LABELS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i <= step ? "#C9A24B" : "#D7DCD4" }}
              />
            ))}
          </div>

          <p className="font-mono uppercase text-gold-700" style={{ fontSize: "10px", letterSpacing: "2px" }}>
            Step {step + 1} of {STEP_LABELS.length}
          </p>
          <h1
            className="mt-1.5 font-heading font-black text-ink"
            style={{ fontSize: "24px", letterSpacing: "-0.5px" }}
          >
            {STEP_LABELS[step]}
          </h1>

          <div className="mt-6">
            {step === 0 && (
              <StepDetails
                form={form}
                onChange={handleChange}
                errors={formErrors}
              />
            )}
            {step === 1 && (
              <StepDelivery value={delivery} onChange={setDelivery} />
            )}
            {step === 2 && <StepConfirm />}
            {step === 3 && (
              <StepPayment advance={advance} method={payment} onMethod={setPayment} onScreenshot={setScreenshotFile} />
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-[10px] bg-error/10 px-3.5 py-2.5 text-[12.5px] text-error">{error}</div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-2.5">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                disabled={submitting}
                className="rounded-[11px] border border-border-strong px-5 py-3.5 font-heading font-bold text-[14px] text-slate transition-colors hover:bg-surface-sunken disabled:opacity-60"
              >
                Back
              </button>
            )}
            {step < STEP_LABELS.length - 1 ? (
              <button
                onClick={() => goToStep(step + 1)}
                className="flex-1 rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[15px] text-bone transition-transform active:scale-[.99] disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={submitOrder}
                disabled={submitting}
                className="shimmer-btn flex flex-1 items-center justify-center gap-2 rounded-[11px] py-3.5 text-center font-heading font-black text-[15px] text-forest shadow-md disabled:opacity-70"
                style={{ boxShadow: "0 8px 22px -10px rgba(201,162,75,.6)" }}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Confirming…" : "Confirm booking"}
              </button>
            )}
          </div>
        </div>
      </div>

      <CheckoutUpsellModal
        open={showUpsell}
        products={upsellSuggestions}
        onAdd={addUpsellProduct}
        onClose={dismissUpsell}
      />
    </div>
  )
}
