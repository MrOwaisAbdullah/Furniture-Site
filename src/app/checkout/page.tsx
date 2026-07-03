"use client"

import { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/lib/store"
import { StepDetails, type DetailsForm } from "@/components/checkout/step-details"
import { StepDelivery, type DeliveryMode } from "@/components/checkout/step-delivery"
import { StepConfirm } from "@/components/checkout/step-confirm"
import { StepPayment, type PaymentMethod } from "@/components/checkout/step-payment"

const STEP_LABELS = ["Your details", "Delivery", "Review & advance", "Payment"]

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<DetailsForm>({ name: "", phone: "", area: "", address: "" })
  const [delivery, setDelivery] = useState<DeliveryMode>("deliver")
  const [payment, setPayment] = useState<PaymentMethod>("bank")

  const { items, totalPrice } = useCartStore()
  const advance = Math.round(totalPrice / 2)

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-[14px] text-slate">Your cart is empty.</p>
        <Link
          href="/shop"
          className="rounded-[10px] bg-forest px-6 py-3.5 font-heading font-bold text-[14px] text-bone"
        >
          Browse sets
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        {/* Progress bar */}
        <div className="mb-5 flex gap-2">
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
              onChange={(next) => setForm((prev) => ({ ...prev, ...next }))}
            />
          )}
          {step === 1 && (
            <StepDelivery value={delivery} onChange={setDelivery} />
          )}
          {step === 2 && (
            <StepConfirm items={items} totalPrice={totalPrice} advance={advance} />
          )}
          {step === 3 && (
            <StepPayment advance={advance} method={payment} onMethod={setPayment} />
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-2.5">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="rounded-[11px] border border-border-strong px-5 py-3.5 font-heading font-bold text-[14px] text-slate transition-colors hover:bg-surface-sunken"
            >
              Back
            </button>
          )}
          {step < STEP_LABELS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex-1 rounded-[11px] bg-forest py-3.5 font-heading font-bold text-[15px] text-bone transition-transform active:scale-[.99]"
            >
              Continue
            </button>
          ) : (
            <Link
              href="/checkout/confirmation"
              className="flex-1 rounded-[11px] bg-gold py-3.5 text-center font-heading font-black text-[15px] text-forest shadow-md"
              style={{ boxShadow: "0 8px 22px -10px rgba(201,162,75,.6)" }}
            >
              Confirm booking
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
