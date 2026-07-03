/* Hallmark · component: card · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus
 */
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      data-state="default"
      className={cn(
        "bg-[var(--color-surface-raised)] rounded-lg border border-[var(--color-border)]",
        "shadow-sm transition-all duration-200 ease-[var(--ease-out-expo)]",
        hover && "hover:shadow-md hover:border-[var(--color-border-strong)] hover:-translate-y-0.5",
        interactive && "cursor-pointer hover:shadow-md hover:border-[var(--color-border-strong)] hover:-translate-y-0.5 active:scale-[0.99]",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-[var(--space-4)] border-b border-[var(--color-border)]", className)}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-[var(--space-4)]", className)} {...props} />
  )
);

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-[var(--space-4)] border-t border-[var(--color-border)]", className)}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-[var(--font-heading)] text-lg font-bold text-[var(--color-ink)]", className)}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-[var(--color-slate)]", className)} {...props} />
  )
);

CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription };
