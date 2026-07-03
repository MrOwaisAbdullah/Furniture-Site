/* Hallmark · component: skeleton · genre: editorial · theme: Yousuf Living
 * states: default (loading animation)
 */
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", width, height, style, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label="Loading"
      style={{
        width: width ?? "100%",
        height: height ?? (variant === "text" ? "1em" : variant === "circular" ? "40px" : "100px"),
        ...style,
      }}
      className={cn(
        "animate-pulse bg-[var(--color-mist)]",
        variant === "text" && "rounded",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-lg",
        className
      )}
      {...props}
    />
  )
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
