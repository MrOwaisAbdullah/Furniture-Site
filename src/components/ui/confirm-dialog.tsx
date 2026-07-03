"use client"

import { AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Modal } from "./modal"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "info" | "success"
  loading?: boolean
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconBg: "bg-error/10",
    iconColor: "text-error",
    confirmBg: "bg-error text-white hover:bg-error/90",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-gold/10",
    iconColor: "text-gold-700",
    confirmBg: "bg-gold text-forest hover:bg-gold/88",
  },
  info: {
    icon: Info,
    iconBg: "bg-forest/10",
    iconColor: "text-forest",
    confirmBg: "bg-forest text-bone hover:bg-forest/90",
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    confirmBg: "bg-forest text-bone hover:bg-forest/90",
  },
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "info",
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", config.iconBg)}>
          <Icon className={cn("h-6 w-6", config.iconColor)} />
        </div>

        <h3 className="mt-4 font-heading font-black text-[18px] text-ink">{title}</h3>
        {description && (
          <p className="mt-2 text-[13.5px] leading-[1.6] text-slate">{description}</p>
        )}

        <div className="mt-6 flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className={cn(
              "flex-1 rounded-[10px] border border-border bg-white py-3 font-heading font-bold text-[13.5px] text-slate",
              "transition-colors hover:bg-surface-sunken active:scale-[.98]",
              "min-h-[44px] cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 rounded-[10px] py-3 font-heading font-bold text-[13.5px]",
              "transition-all active:scale-[.98]",
              "min-h-[44px] cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              config.confirmBg
            )}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
