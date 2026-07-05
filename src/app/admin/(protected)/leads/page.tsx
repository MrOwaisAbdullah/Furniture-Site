import { getLeads, getEmailSubscribers } from "@/lib/neon/queries"
import { EmptyState } from "@/components/ui/empty-state"
import { Inbox, Mail } from "lucide-react"
import { LeadsList } from "@/components/admin/leads-list"
import { EmailSubscribersList } from "@/components/admin/email-subscribers-list"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const [leads, subscribers] = await Promise.all([getLeads(), getEmailSubscribers()])

  return (
    <div className="p-6">
      {/* Newsletter subscribers */}
      <div className="mb-10">
        <h2 className="font-heading text-sm font-bold text-forest">
          Newsletter Subscribers
        </h2>
        <p className="font-mono text-[11px] text-sage">{subscribers.length} subscribers</p>

        <div className="mt-4">
          {subscribers.length === 0 ? (
            <EmptyState
              icon={<Mail className="h-8 w-8 text-slate" />}
              title="No subscribers yet"
              description="Newsletter signups from the footer will appear here."
            />
          ) : (
            <EmailSubscribersList subscribers={subscribers} />
          )}
        </div>
      </div>

      {/* Contact form leads */}
      <div>
        <h2 className="font-heading text-sm font-bold text-forest">
          Contact Inquiries
        </h2>
        <p className="font-mono text-[11px] text-sage">{leads.length} inquiries</p>

        <div className="mt-4">
          {leads.length === 0 ? (
            <EmptyState
              icon={<Inbox className="h-8 w-8 text-slate" />}
              title="No leads yet"
              description="Inquiries from the contact form and product pages will show up here."
            />
          ) : (
            <LeadsList leads={leads} />
          )}
        </div>
      </div>
    </div>
  )
}
