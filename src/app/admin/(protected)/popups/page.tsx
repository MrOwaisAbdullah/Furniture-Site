import { formatPrice } from "@/lib/utils"
import { getAllPopups } from "@/lib/sanity/queries"
import { getPopupVariantStats, getPopupConversions } from "@/lib/neon/queries"
import { HorizontalBarChart } from "@/components/admin/horizontal-bar-chart"

export const dynamic = "force-dynamic"

interface VariantRow {
  variant: string
  impressions: number
  sessions: number
  dismissed: number
  clicked: number
  conversions: number
  revenue: number
}

function buildRows(
  variantNames: string[],
  stats: { variant: string; event: string; count: number; sessions: number }[],
  conversions: { variant: string; conversions: number; revenue: number }[]
): VariantRow[] {
  return variantNames.map((name) => {
    const view = stats.find((s) => s.variant === name && s.event === "promo_popup_view")
    const click = stats.find((s) => s.variant === name && s.event === "promo_popup_click")
    const dismiss = stats.find((s) => s.variant === name && s.event === "promo_popup_dismiss")
    const conv = conversions.find((c) => c.variant === name)
    return {
      variant: name,
      impressions: view?.count ?? 0,
      sessions: view?.sessions ?? 0,
      dismissed: dismiss?.count ?? 0,
      clicked: click?.count ?? 0,
      conversions: conv?.conversions ?? 0,
      revenue: conv?.revenue ?? 0,
    }
  })
}

export default async function AdminPopupsPage() {
  const campaigns = await getAllPopups()

  const to = new Date()
  const from = new Date(to.getTime() - 30 * 86_400_000)

  const perCampaign = await Promise.all(
    campaigns.map(async (c) => {
      const [stats, conversions] = await Promise.all([
        getPopupVariantStats(c._id, from, to),
        getPopupConversions(c._id, from, to),
      ])
      const rows = buildRows(c.variants.map((v) => v.name), stats, conversions)
      return { campaign: c, rows }
    })
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] text-sage">Last 30 days</p>
        <p className="font-mono text-[10px] text-sage">Counted by unique browser session, not device</p>
      </div>

      {/* Popup campaigns today; an "Announcement bar" section can join this
          page later without another nav rename — this is marketing surfaces
          in general, not popups specifically. */}
      <h1 className="mt-6 font-heading font-bold text-[17px] text-ink">Popup campaigns</h1>

      {perCampaign.length === 0 && (
        <p className="mt-8 px-4 py-8 text-center font-mono text-[11px] text-sage">
          No popup campaigns yet. Create one in Content Studio.
        </p>
      )}

      {perCampaign.map(({ campaign, rows }) => {
        const totalImpressions = rows.reduce((sum, r) => sum + r.impressions, 0)
        const ctrData = rows.map((r) => ({
          label: r.variant,
          value: r.impressions > 0 ? Math.round((r.clicked / r.impressions) * 1000) / 10 : 0,
          sublabel: `${r.clicked} click${r.clicked === 1 ? "" : "s"} / ${r.impressions} view${r.impressions === 1 ? "" : "s"}`,
          tone: "gold" as const,
        }))

        return (
          <div key={campaign._id} className="mt-7">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-[15px] text-ink">{campaign.title}</h2>
              <span className={`font-mono text-[10px] ${campaign.active ? "text-forest" : "text-sage"}`}>
                {campaign.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-3 overflow-x-auto rounded-[14px] border border-border bg-white">
              <table className="w-full min-w-[640px] text-left text-[12px]">
                <thead>
                  <tr className="border-b border-border font-mono text-[10px] uppercase text-sage">
                    <th className="px-4 py-3">Variant</th>
                    <th className="px-4 py-3">Impressions</th>
                    <th className="px-4 py-3">Sessions</th>
                    <th className="px-4 py-3">Dismissed</th>
                    <th className="px-4 py-3">Clicked</th>
                    <th className="px-4 py-3">CTR</th>
                    <th className="px-4 py-3">Conversions</th>
                    <th className="px-4 py-3">Conv. rate</th>
                    <th className="px-4 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.variant} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">{r.variant}</td>
                      <td className="px-4 py-3">{r.impressions}</td>
                      <td className="px-4 py-3">{r.sessions}</td>
                      <td className="px-4 py-3">{r.dismissed}</td>
                      <td className="px-4 py-3">{r.clicked}</td>
                      <td className="px-4 py-3">{r.impressions > 0 ? `${Math.round((r.clicked / r.impressions) * 1000) / 10}%` : "—"}</td>
                      <td className="px-4 py-3">{r.conversions}</td>
                      <td className="px-4 py-3">{r.clicked > 0 ? `${Math.round((r.conversions / r.clicked) * 1000) / 10}%` : "—"}</td>
                      <td className="px-4 py-3 font-mono text-[11px] font-bold text-forest">{formatPrice(r.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <p className="px-4 py-8 text-center font-mono text-[11px] text-sage">No variants configured.</p>
              )}
            </div>

            {totalImpressions > 0 && (
              <div className="mt-3 overflow-hidden rounded-[14px] border border-border bg-white">
                <HorizontalBarChart data={ctrData} valueFormatter={(v) => `${v}%`} emptyMessage="No impressions yet." />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
