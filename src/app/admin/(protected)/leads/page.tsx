import { getLeads } from "@/lib/neon/queries"
import { EmptyState } from "@/components/ui/empty-state"
import { Inbox } from "lucide-react"
import { LeadsList } from "@/components/admin/leads-list"

export const dynamic = "force-dynamic"

export default async function AdminLeadsPage() {
  const leads = await getLeads()

  return (
    <div className="p-6">
      <h1 className="font-heading font-black text-[22px] text-ink" style={{ letterSpacing: "-0.4px" }}>
        Leads inbox
      </h1>
      <p className="mt-0.5 font-mono text-[11px] text-sage">{leads.length} inquiries</p>

      <div className="mt-5">
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
  )
}
