import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Returns & Refunds — Yousuf Living",
  description: "Our policy on returns, refunds, and cancellations for custom furniture.",
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-heading font-black text-ink" style={{ fontSize: "clamp(24px,4vw,34px)" }}>
          Returns &amp; Refunds
        </h1>
        <p className="mt-2 font-mono text-[11px] text-sage">Last updated: July 2026</p>

        <div className="mt-8 space-y-8 text-[14px] leading-[1.75] text-slate">
          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">The short version</h2>
            <p>
              Every piece is built to order. We do not accept returns because you changed your mind about the color,
              size, or design. If something arrives damaged or breaks because of how we built it, we will fix or
              replace it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Cancellations</h2>
            <p>
              Cancel within 24 hours for a full refund of your advance. After that, if we have already started
              cutting materials or building, we deduct the material costs and return the rest. Once the piece is
              done, we cannot cancel.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Defects and damage</h2>
            <p>
              If your piece has a manufacturing defect, or if it arrived damaged, contact us within 7 days with
              photos. We will send someone to look at it, or ask you to ship it back if that is easier. We cover
              return shipping for defective items.
            </p>
            <p className="mt-2">
              What counts as a defect: joints failing under normal use, drawers that will not slide, finish
              peeling or bubbling on its own, structural issues that show up during regular use.
            </p>
            <p className="mt-2">
              What does not count: scratches from moving, stains from spills, damage from sunlight or water,
              general wear and tear from years of use.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">How refunds work</h2>
            <p>
              If we cannot fix the issue, we will replace the piece or refund you. Refunds go back to the same
              account you paid from. Bank transfers take 3 to 5 business days. EasyPaisa refunds land within
              24 hours.
            </p>
            <p className="mt-2">
              We do not offer partial refunds for minor cosmetic issues that do not affect how the piece works.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">What you can do</h2>
            <p>
              If something is wrong, message us on WhatsApp with your order ref and photos. We usually respond
              within a few hours during business days. The faster you reach out, the faster we can help.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
