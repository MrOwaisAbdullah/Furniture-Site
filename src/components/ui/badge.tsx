/* Hallmark · component: badge · genre: editorial · theme: Yousuf Living
 * states: default
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "gold" | "outline";
  size?: "sm" | "md";
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center font-[var(--font-mono)] rounded-full whitespace-nowrap",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        variant === "default" && "bg-[var(--color-mist)] text-[var(--color-ink)]",
        variant === "success" && "bg-[var(--color-success-light)] text-[var(--color-success)]",
        variant === "warning" && "bg-[var(--color-gold)]/20 text-[var(--color-forest)]",
        variant === "error" && "bg-[var(--color-error-light)] text-[var(--color-error)]",
        variant === "gold" && "bg-[var(--color-gold)] text-[var(--color-forest)]",
        variant === "outline" && "border border-[var(--color-border)] text-[var(--color-slate)]",
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = "Badge";

export { Badge };
