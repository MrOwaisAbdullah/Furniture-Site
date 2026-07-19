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
  errors: Partial<Record<keyof DetailsForm, string>>
}

const KARACHI_AREAS = [
  "DHA", "Clifton", "Gulshan-e-Iqbal", "North Nazimabad",
  "Nazimabad", "Gulberg", "Saddar", "Korangi", "Other Karachi",
]

const fieldCls = "w-full rounded-[10px] border bg-white px-3.5 py-3.5 text-[13.5px] text-ink placeholder:text-sage/60 focus:border-forest focus:outline-none"
const fieldClsErr = "border-error"
const fieldClsOk = "border-border-strong"
const errorCls = "mt-1.5 text-[11.5px] text-error"

export function StepDetails({ form, onChange, errors }: StepDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">Full name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Ahmed Khan"
          className={cn(fieldCls, errors.name ? fieldClsErr : fieldClsOk)}
        />
        {errors.name && <p className={errorCls}>{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">WhatsApp number</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="+92 3XX XXXXXXX"
          className={cn(fieldCls, errors.phone ? fieldClsErr : fieldClsOk, "font-mono")}
        />
        {errors.phone && <p className={errorCls}>{errors.phone}</p>}
      </div>

      <div>
        <ThemedSelect
          label="Delivery area"
          value={form.area}
          onChange={(v) => onChange({ area: v })}
          placeholder="Select your area"
          options={KARACHI_AREAS.map((a) => ({ value: a, label: a }))}
        />
        {errors.area && <p className={errorCls}>{errors.area}</p>}
      </div>

      <div>
        <label className="mb-1.5 block font-body font-semibold text-[12.5px] text-slate">Full address</label>
        <textarea
          value={form.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="House #, street, area, nearest landmark"
          className={cn(fieldCls, errors.address ? fieldClsErr : fieldClsOk)}
          rows={3}
        />
        {errors.address && <p className={errorCls}>{errors.address}</p>}
      </div>
    </div>
  )
}
