"use client"

import { useState, useRef } from "react"
import { Upload, Copy, Check, X, FileImage } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/utils"
import {
  BANK_NAME, BANK_ACCOUNT_TITLE, BANK_ACCOUNT_NUMBER, BANK_IBAN,
  EASYPAISA_ACCOUNT_NUMBER, EASYPAISA_ACCOUNT_NAME, ADDRESS_FULL,
} from "@/lib/site-config"

export type PaymentMethod = "bank" | "easypaisa" | "cash"

interface StepPaymentProps {
  advance: number
  method: PaymentMethod
  onMethod: (m: PaymentMethod) => void
  onScreenshot?: (file: File | null) => void
}

const METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "bank",       label: "Bank transfer" },
  { id: "easypaisa",  label: "EasyPaisa / JazzCash" },
  { id: "cash",       label: "Cash at showroom" },
]

const BANK_ROWS = [
  { label: "Bank",    value: BANK_NAME,          mono: false },
  { label: "Title",   value: BANK_ACCOUNT_TITLE, mono: false },
  { label: "Account", value: BANK_ACCOUNT_NUMBER, mono: true },
  { label: "IBAN",    value: BANK_IBAN,          mono: true },
]

const EASYPAISA_ROWS = [
  { label: "Account", value: EASYPAISA_ACCOUNT_NUMBER, mono: true },
  { label: "Name",    value: EASYPAISA_ACCOUNT_NAME,   mono: false },
]

export function StepPayment({ advance, method, onMethod, onScreenshot }: StepPaymentProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val)
    setCopied(val)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert("File is too large. Maximum size is 5 MB.")
      return
    }

    setSelectedFile(file)
    onScreenshot?.(file)

    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    onScreenshot?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const infoRows = method === "bank" ? BANK_ROWS : method === "easypaisa" ? EASYPAISA_ROWS : []

  return (
    <div>
      {/* Advance amount */}
      <div
        className="mb-4 flex items-center justify-between rounded-[11px] px-4 py-3.5"
        style={{ background: "#16352A" }}
      >
        <span className="text-[12.5px] text-bone/70">Advance to pay now</span>
        <span className="font-mono font-bold text-[20px] text-gold">{formatPrice(advance)}</span>
      </div>

      {/* Method selector */}
      <p className="mb-3 font-body font-semibold text-[12.5px] text-slate">Payment method</p>
      <div className="flex flex-col gap-2.5">
        {METHODS.map((m) => {
          const active = method === m.id
          return (
            <button
              key={m.id}
              onClick={() => onMethod(m.id)}
              className={cn(
                "flex items-center gap-3 rounded-[11px] border-2 p-3.5 text-left transition-colors",
                active ? "border-forest bg-white" : "border-border bg-white"
              )}
            >
              <div
                className={cn(
                  "h-[18px] w-[18px] shrink-0 rounded-full border-2 transition-colors",
                  active ? "border-[5px] border-forest" : "border-border-strong"
                )}
              />
              <span className="font-heading font-bold text-[13.5px] text-ink">{m.label}</span>
            </button>
          )
        })}
      </div>

      {/* Bank/EasyPaisa details */}
      {infoRows.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-[12px] border border-border bg-white">
          <div className="bg-surface-sunken px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[1.5px] text-gold-700">
            {method === "bank" ? "Transfer to" : "Send to"}
          </div>
          {infoRows.map((row, i) => (
            <div
              key={row.label}
              className={cn("flex items-center justify-between px-3.5 py-3", i > 0 && "border-t border-border")}
            >
              <span className="text-[12px] text-sage">{row.label}</span>
              <div className="flex items-center gap-2">
                <span className={cn("text-[12.5px] font-semibold text-ink", row.mono && "font-mono")}>
                  {row.value}
                </span>
                {row.mono && (
                  <button
                    onClick={() => copyValue(row.value)}
                    className="text-sage hover:text-forest"
                    aria-label={`Copy ${row.label}`}
                  >
                    {copied === row.value
                      ? <Check className="h-3.5 w-3.5 stroke-success" />
                      : <Copy className="h-3.5 w-3.5" />
                    }
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {method === "cash" && (
        <div className="mt-4 rounded-[12px] border border-border bg-white p-4">
          <p className="font-heading font-bold text-[14px] text-ink">Pay at our showroom</p>
          <p className="mt-1 text-[13px] text-slate">{ADDRESS_FULL}. We&apos;ll WhatsApp you to confirm the time.</p>
        </div>
      )}

      {/* Screenshot upload (bank + easypaisa only) */}
      {method !== "cash" && !selectedFile && (
        <label className="relative mt-4 flex cursor-pointer select-none flex-col items-center gap-2 rounded-[11px] border-2 border-dashed border-gold bg-gold/5 py-6 transition-colors hover:bg-gold/10">
          <div className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full bg-gold/15">
            <Upload className="h-5 w-5 stroke-gold-700" />
          </div>
          <p className="pointer-events-none font-body font-semibold text-[12.5px] text-gold-900">Upload payment screenshot</p>
          <p className="pointer-events-none text-[10.5px] text-sage">JPG · PNG · PDF · max 5 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            aria-label="Upload payment screenshot"
            onChange={handleFileChange}
          />
        </label>
      )}

      {/* File preview */}
      {method !== "cash" && selectedFile && (
        <div className="mt-4 rounded-[11px] border border-border bg-white p-3">
          <div className="flex items-center gap-3">
            {preview && selectedFile.type.startsWith("image/") ? (
              <img
                src={preview}
                alt="Payment screenshot preview"
                className="h-16 w-16 rounded-[8px] border border-border object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-[8px] bg-surface">
                <FileImage className="h-6 w-6 text-sage" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate font-heading font-bold text-[12.5px] text-ink">{selectedFile.name}</p>
              <p className="font-mono text-[10px] text-sage">
                {(selectedFile.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="flex h-8 w-8 items-center justify-center rounded-full text-sage hover:bg-error/10 hover:text-error"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <p className="mt-3 text-[11px] text-sage leading-[1.55]">
        Your build slot is only confirmed once we verify payment. We WhatsApp you within 2 hours.
      </p>
    </div>
  )
}
