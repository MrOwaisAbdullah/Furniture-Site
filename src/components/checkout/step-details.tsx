"use client"

import { cn } from "@/lib/utils"
import { ThemedSelect } from "@/components/ui/themed-select"

export interface DetailsForm {
  name: string
  phone: string
  area: string
  address: string
}

interface StepDetailsProps {
  form: DetailsForm
  onChange: (next: Partial<DetailsForm>) => void
}

const KARACHI_AREAS = [
  "DHA", "Clifton", "Gulshan-e-Iqbal", "North Nazimabad",
  "Nazimabad", "Gulberg", "Saddar", "Korangi", "Other Karachi",
]

const fieldCls = "w-full rounded-[10px] border border-border-strong bg-white px-3.5 py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"

export function StepDetails({ form, onChange }: StepDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">Full name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Ahmed Khan"
          className={fieldCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">WhatsApp number</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+92 3XX XXXXXXX"
          className={cn(fieldCls, "font-mono")}
        />
      </div>

      <div>
        <ThemedSelect
          label="Delivery area"
          value={form.area}
          onChange={(v) => onChange({ area: v })}
          placeholder="Select your area"
          options={KARACHI_AREAS.map((a) => ({ value: a, label: a }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">Full address</label>
        <textarea
          value={form.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="House #, street, area, nearest landmark"
          className={fieldCls}
          rows={3}
        />
      </div>
    </div>
  )
}
