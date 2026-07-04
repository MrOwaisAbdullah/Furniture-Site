import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Yousuf Living",
  description: "How Yousuf Living handles your personal data, orders, and cookies.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-heading font-black text-ink" style={{ fontSize: "clamp(24px,4vw,34px)" }}>
          Privacy Policy
        </h1>
        <p className="mt-2 font-mono text-[11px] text-sage">Last updated: July 2026</p>

        <div className="mt-8 space-y-8 text-[14px] leading-[1.75] text-slate">
          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">What we collect</h2>
            <p>
              When you place an order or fill out a form on our site, we ask for your name, phone number, delivery
              address, and email. That is pretty standard. We also collect basic browsing data, like which pages you
              visit and how long you spend on them, through analytics tools.
            </p>
            <p className="mt-2">
              If you upload a payment screenshot, that image is stored on our servers so our team can verify your
              payment. We do not run facial recognition on it or anything like that.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">How we use it</h2>
            <p>We use your information to:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Process and deliver your order</li>
              <li>Send you WhatsApp updates about your build slot and delivery</li>
              <li>Reply when you contact us through the form or WhatsApp</li>
              <li>Improve the site based on how people actually use it</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Who sees it</h2>
            <p>
              We do not sell your data to anyone. The only third parties that touch your information are the services
              we use to run the business: our payment processor, our hosting provider, and our analytics tool. Each of
              them has their own privacy policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Cookies</h2>
            <p>
              Our site uses a few cookies. One keeps your cart items between page loads. Another remembers your
              affiliate code if someone referred you. Analytics tools set their own cookies to track page views. You can
              disable cookies in your browser, but your cart will not work without them.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Data security</h2>
            <p>
              We take reasonable steps to protect your information. Our site runs over HTTPS, and our database is
              encrypted at rest. That said, no system is perfectly secure. If you have concerns about how your data is
              handled, reach out to us directly.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Your rights</h2>
            <p>
              You can ask us to show you what data we hold about you, correct anything that is wrong, or delete your
              records entirely. Just send us a message on WhatsApp or email us. We will take care of it within 7 days.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Changes to this policy</h2>
            <p>
              We might update this page from time to time. If we make a meaningful change, we will mention it on our
              social media or send a WhatsApp broadcast to recent customers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-heading font-bold text-[16px] text-ink">Contact us</h2>
            <p>
              Questions about this policy? Reach us on WhatsApp at{" "}
              <a href="https://wa.me/923323661071" className="text-forest underline">
                +92 332 366 1071
              </a>{" "}
              or email us at the address on our contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
