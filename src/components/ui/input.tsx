/* Hallmark · component: input · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · error · success · loading
 */
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check, AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success = false,
      loading = false,
      hint,
      leftIcon,
      rightIcon,
      disabled,
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-ink)] mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled || loading}
            data-state={hasError ? "error" : success ? "success" : loading ? "loading" : "default"}
            className={cn(
              "w-full px-3 py-2.5 border rounded-lg",
              "bg-[var(--color-surface-raised)] text-[var(--color-ink)]",
              "placeholder:text-[var(--color-slate)]/50",
              "transition-all duration-200 ease-[var(--ease-out-expo)]",
              "min-h-[44px]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-focus-ring)]",
              "hover:border-[var(--color-border-strong)]",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-surface-sunken)]",
              hasError && "border-[var(--color-error)] focus:ring-[var(--color-error)]",
              success && !hasError && "border-[var(--color-success)]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--color-slate)]" />}
            {!loading && success && <Check className="w-4 h-4 text-[var(--color-success)]" />}
            {!loading && hasError && <AlertCircle className="w-4 h-4 text-[var(--color-error)]" />}
            {!loading && !success && !hasError && rightIcon}
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

Input.displayName = "Input";

export { Input };
