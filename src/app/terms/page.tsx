import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions — Yousuf Living",
  description: "Terms of service for ordering furniture from Yousuf Living.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-heading font-black text-ink" style={{ fontSize: "clamp(24px,4vw,34px)" }}>
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 font-mono text-[11px] text-sage">Last updated: July 2026</p>

        <div className="mt-8 space-y-8 text-[14px] leading-[1.75] text-slate">
          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Orders and payments</h2>
            <p>
              To confirm your order, you pay a 30 to 50 percent advance. The remaining balance is due before delivery.
              We accept bank transfers, EasyPaisa, JazzCash, and cash at our showroom in Karachi. Until we verify your
              payment, your order stays on hold.
            </p>
            <p className="mt-2">
              If you pay via bank transfer or EasyPaisa, please upload a screenshot of the payment confirmation in the
              checkout flow. Our team checks these within 2 hours during business hours.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Build timelines</h2>
            <p>
              Most orders take 2 to 3 weeks to build, depending on the piece and current demand. We give you an
              estimated delivery window when we confirm your order. If something comes up and we expect a delay, we
              will WhatsApp you with an update.
            </p>
            <p className="mt-2">
              Delivery is handled by our own team within Karachi. For orders outside Karachi, we arrange shipping but
              the timeline depends on your location.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Cancellations</h2>
            <p>
              You can cancel your order within 24 hours for a full refund of your advance. After that, if we have already
              started cutting materials or assembling your piece, we deduct the material costs and refund the rest.
              Once the piece is complete, cancellations are not possible.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Returns and defects</h2>
            <p>
              We build everything to order, so we do not accept general returns if you changed your mind about the
              color or size. If your piece arrives damaged or has a manufacturing defect, contact us within 7 days with
              photos. We will either repair it or replace it, depending on what makes sense.
            </p>
            <p className="mt-2">
              Normal wear and tear, damage from misuse, or damage caused by moving the furniture yourself does not
              count as a defect.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Warranty</h2>
            <p>
              Every piece of furniture comes with a 5 year warranty covering structural defects. This covers joints
              failing under normal use, drawers that stop sliding, and similar issues. It does not cover scratches,
              stains, water damage, or cosmetic wear.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Pricing</h2>
            <p>
              All prices are in Pakistani Rupees. We reserve the right to change prices without notice, but the price
              quoted at the time of your order is the price you pay. If there is a pricing error on our site, we will
              contact you before processing your order.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Coupons and discounts</h2>
            <p>
              Coupons have their own terms, like minimum order values and expiration dates. We list those on the coupon
              itself. Unless stated otherwise, only one coupon can be used per order. We do not apply coupons
              retroactively.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Product images</h2>
            <p>
              We try to show colors accurately, but screens vary. The actual color of your furniture might look
              slightly different from what you see on your phone or laptop. Dimensions listed on the site are
              approximate. If exact dimensions matter for your space, message us before ordering.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Limitation of liability</h2>
            <p>
              If something goes wrong with your order, our maximum liability is limited to the amount you paid for that
              order. We are not responsible for indirect damages, lost time, or other consequences beyond the cost of
              the furniture itself.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Governing law</h2>
            <p>
              These terms are governed by the laws of Pakistan. Any disputes will be handled in the courts of Karachi.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Contact</h2>
            <p>
              Something not clear? Reach us on WhatsApp at{" "}
              <a href="https://wa.me/923323661071" className="text-forest underline">
                +92 332 366 1071
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
