import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping & Delivery — Yousuf Living",
  description: "How we deliver furniture across Karachi and Pakistan.",
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-heading font-black text-ink" style={{ fontSize: "clamp(24px,4vw,34px)" }}>
          Shipping &amp; Delivery
        </h1>
        <p className="mt-2 font-mono text-[11px] text-sage">Last updated: July 2026</p>

        <div className="mt-8 space-y-8 text-[14px] leading-[1.75] text-slate">
          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Karachi delivery</h2>
            <p>
              We deliver across Karachi with our own team. Delivery charges depend on your location and the items
              you order — furniture is heavy, so charges start from Rs 3,000 and go up for bigger or heavier
              pieces. Once your piece is ready, we call to find a time that works, then WhatsApp you again
              when we are on the way.
            </p>
            <p className="mt-2">
              Most Karachi deliveries land within 2 to 3 weeks after you confirm your order.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Other cities</h2>
            <p>
              We ship nationwide through transport partners. Costs depend on the piece and where you are. Send us a
              WhatsApp with your city and what you want, and we will get back to you with a quote.
            </p>
            <p className="mt-2">
              Plan for 5 to 10 business days after the piece is ready. We pack everything tight to avoid damage
              on the road.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Showroom pickup</h2>
            <p>
              Pick up from our showroom in Manzoor Colony, Karachi. We will text you when it is ready. Open
              Monday through Sunday, 10am to 11pm.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">At your door</h2>
            <p>
              Our crew brings the piece into your room and drops it where you want. They also haul away the
              packaging. If you spot damage during delivery, tell the driver right away and snap a few photos.
              We will fix it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Mattresses</h2>
            <p>
              Beds and bed sets are delivered without a mattress — the bed frame comes with its slat base ready
              for any mattress. We can point you to a mattress that fits on WhatsApp if you like.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Measure first</h2>
            <p>
              Check your doorways, staircases, and the spot where the furniture will live. If the piece does not
              fit through your door, we will try to help, but disassembly or special handling may cost extra.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
