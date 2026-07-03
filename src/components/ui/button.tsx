/* Hallmark · component: button · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · loading · error · success
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      success = false,
      error = false,
      disabled = false,
      icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        data-state={
          loading ? "loading" : success ? "success" : error ? "error" : "default"
        }
        className={cn(
          /* Base */
          "relative inline-flex items-center justify-center gap-2 font-medium",
          "transition-all duration-200 ease-[var(--ease-out-expo)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2",
          "min-h-[44px] min-w-[44px] cursor-pointer select-none",
          "disabled:cursor-not-allowed disabled:opacity-50",

          /* Primary */
          variant === "primary" && [
            "bg-[var(--color-forest)] text-[var(--color-bone)]",
            "hover:bg-[var(--color-forest-light)] hover:shadow-lg hover:shadow-[var(--color-forest)]/20",
            "active:scale-[0.98] active:bg-[var(--color-forest)]",
            success && "bg-[var(--color-success)] hover:bg-[var(--color-success)]",
            error && "bg-[var(--color-error)] hover:bg-[var(--color-error)]",
          ],

          /* Secondary */
          variant === "secondary" && [
            "bg-[var(--color-gold)] text-[var(--color-forest)]",
            "hover:bg-[var(--color-gold-light)] hover:shadow-lg hover:shadow-[var(--color-gold)]/20",
            "active:scale-[0.98] active:bg-[var(--color-gold)]",
          ],

          /* Ghost */
          variant === "ghost" && [
            "bg-transparent text-[var(--color-ink)]",
            "hover:bg-[var(--color-surface-sunken)]",
            "active:scale-[0.98]",
          ],

          /* Outline */
          variant === "outline" && [
            "bg-transparent border-2 border-[var(--color-forest)] text-[var(--color-forest)]",
            "hover:bg-[var(--color-forest)] hover:text-[var(--color-bone)]",
            "active:scale-[0.98]",
          ],

          /* Danger */
          variant === "danger" && [
            "bg-[var(--color-error)] text-white",
            "hover:bg-[var(--color-error)]/90 hover:shadow-lg hover:shadow-[var(--color-error)]/20",
            "active:scale-[0.98]",
          ],

          /* Sizes */
          size === "sm" && "text-sm px-3 py-1.5",
          size === "md" && "text-base px-5 py-2.5",
          size === "lg" && "text-lg px-6 py-3",

          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && iconPosition === "left" && icon}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
