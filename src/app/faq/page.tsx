import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ — Yousuf Living",
  description: "Common questions about ordering, delivery, and payment.",
}

const faqs = [
  {
    q: "How long does it take to build my order?",
    a: "Most pieces take 2 to 3 weeks. Complete bedroom sets take 3 to 4 weeks. We WhatsApp you at every stage so you know what is happening.",
  },
  {
    q: "Do I have to pay the full amount upfront?",
    a: "No. You pay a 30 to 50 percent advance to confirm your order. The rest is due before we deliver.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Bank transfer, EasyPaisa, JazzCash, and cash at our showroom. Upload a screenshot of your payment in checkout so we can verify it quickly.",
  },
  {
    q: "Can I cancel my order?",
    a: "Within 24 hours, yes, full refund. After that, we deduct material costs if we have already started building. Once the piece is complete, we cannot cancel.",
  },
  {
    q: "Do you deliver outside Karachi?",
    a: "Yes, we ship nationwide through transport partners. Costs and timelines depend on your city. Message us on WhatsApp for a quote.",
  },
  {
    q: "What if my furniture does not fit through the door?",
    a: "Measure your doorways before ordering. If the piece does not fit, our team will try to help, but disassembly may cost extra.",
  },
  {
    q: "Can I change the color or size after ordering?",
    a: "If we have not started building yet, usually yes. Once materials are cut, changes are not possible. Message us as soon as possible.",
  },
  {
    q: "What is the warranty?",
    a: "5 years on structural defects. This covers joints, drawers, and similar issues under normal use. It does not cover scratches, stains, or water damage.",
  },
  {
    q: "How do I care for my furniture?",
    a: "Wipe with a dry cloth. Keep it out of direct sunlight. Avoid placing wet items directly on the surface. That is about it.",
  },
  {
    q: "Can I visit the showroom before ordering?",
    a: "Absolutely. Our showroom is in Manzoor Colony, Karachi. Open Monday to Sunday, 10am to 11pm. No appointment needed.",
  },
  {
    q: "Do you offer installments?",
    a: "Not yet. We are working on it. For now, it is advance plus balance before delivery.",
  },
  {
    q: "What if the color looks different from the website?",
    a: "Screens display colors differently. The actual piece may look slightly different. If exact color matters, visit the showroom or message us for more photos.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-heading font-black text-ink" style={{ fontSize: "clamp(24px,4vw,34px)" }}>
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-[14px] text-slate">
          Got a question that is not here? Message us on{" "}
          <a href="https://wa.me/923323661071" className="text-forest underline">
            WhatsApp
          </a>
          .
        </p>

        <div className="mt-8 space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-[12px] border border-border bg-white"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-heading font-bold text-[14px] text-ink list-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="shrink-0 text-sage transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="border-t border-border px-5 py-4 text-[13.5px] leading-[1.65] text-slate">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
