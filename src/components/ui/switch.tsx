/* Hallmark · component: switch · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · error · success · loading
 */
"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      onChange,
      label,
      description,
      error,
      success = false,
      loading = false,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

    return (
      <div className="w-full">
        <label
          htmlFor={switchId}
          className={cn(
            "flex items-center gap-3 min-h-[44px] cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
        >
          <div className="relative flex items-center shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              checked={checked}
              disabled={disabled || loading}
              onChange={(e) => onChange?.(e.target.checked)}
              className="sr-only"
              aria-invalid={hasError}
              {...props}
            />
            <div
              className={cn(
                "w-11 h-6 rounded-full transition-all duration-200 ease-[var(--ease-out-expo)] relative",
                checked
                  ? "bg-[var(--color-forest)]"
                  : "bg-[var(--color-mist)]",
                hasError && !checked && "bg-[var(--color-error)]/20 border border-[var(--color-error)]",
                success && !hasError && !checked && "bg-[var(--color-success)]/20 border border-[var(--color-success)]"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm",
                  "transition-transform duration-200 ease-[var(--ease-out-expo)]",
                  "flex items-center justify-center",
                  checked && "translate-x-5"
                )}
              >
                {loading && (
                  <Loader2 className="w-3 h-3 animate-spin text-[var(--color-forest)]" />
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            {label && (
              <span className="text-sm font-medium text-[var(--color-ink)] block">{label}</span>
            )}
            {description && (
              <p className="text-xs text-[var(--color-slate)]">{description}</p>
            )}
          </div>
        </label>
        {hasError && <p className="mt-1 text-xs text-[var(--color-error)] ml-14">{error}</p>}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
