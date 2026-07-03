/* Hallmark · component: checkbox · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · error · success · loading
 */
"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Check, Minus, Loader2 } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      onChange,
      label,
      description,
      error,
      success = false,
      loading = false,
      indeterminate = false,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

    return (
      <div className="w-full">
        <label
          htmlFor={checkboxId}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg min-h-[44px]",
            "border transition-all duration-200 ease-[var(--ease-out-expo)]",
            "cursor-pointer",
            checked
              ? "border-[var(--color-forest)] bg-[var(--color-forest)]/5"
              : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
            hasError && "border-[var(--color-error)]",
            success && !hasError && checked && "border-[var(--color-success)]",
            disabled && "opacity-50 cursor-not-allowed bg-[var(--color-surface-sunken)]",
            className
          )}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              disabled={disabled || loading}
              onChange={(e) => onChange?.(e.target.checked)}
              className="sr-only"
              aria-invalid={hasError}
              {...props}
            />
            <div
              className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
                checked || indeterminate
                  ? "bg-[var(--color-forest)] border-[var(--color-forest)]"
                  : "bg-[var(--color-surface-raised)] border-[var(--color-border-strong)]",
                hasError && "border-[var(--color-error)]",
                success && !hasError && "border-[var(--color-success)]"
              )}
            >
              {loading ? (
                <Loader2 className="w-3 h-3 animate-spin text-white" />
              ) : indeterminate ? (
                <Minus className="w-3 h-3 text-white" />
              ) : checked ? (
                <Check className="w-3 h-3 text-white" />
              ) : null}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {label && (
              <span className="text-sm font-medium text-[var(--color-ink)] block">{label}</span>
            )}
            {description && (
              <p className="text-xs text-[var(--color-slate)] mt-0.5">{description}</p>
            )}
          </div>
        </label>
        {hasError && <p className="mt-1 text-xs text-[var(--color-error)] ml-3">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
