/* Hallmark · component: select · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · error · success · loading
 */
import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  hint?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      success = false,
      loading = false,
      hint,
      options,
      placeholder = "Select...",
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--color-ink)] mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled || loading}
            data-state={hasError ? "error" : success ? "success" : loading ? "loading" : "default"}
            className={cn(
              "w-full appearance-none px-3 py-2.5 pr-10 border rounded-lg",
              "bg-[var(--color-surface-raised)] text-[var(--color-ink)]",
              "transition-all duration-200 ease-[var(--ease-out-expo)]",
              "min-h-[44px] cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-focus-ring)]",
              "hover:border-[var(--color-border-strong)]",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-surface-sunken)]",
              hasError && "border-[var(--color-error)] focus:ring-[var(--color-error)]",
              success && !hasError && "border-[var(--color-success)]",
              className
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[var(--color-slate)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--color-slate)]" />
            )}
          </div>
        </div>
        {hint && !hasError && (
          <p className="mt-1 text-xs text-[var(--color-slate)]">{hint}</p>
        )}
        {hasError && <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
