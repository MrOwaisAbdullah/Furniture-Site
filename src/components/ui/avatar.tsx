/* Hallmark · component: avatar · genre: editorial · theme: Yousuf Living
 * states: default · loaded · error · fallback
 */
"use client";

import { forwardRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const statusColors = {
  online: "bg-[var(--color-success)]",
  offline: "bg-[var(--color-mist)]",
  away: "bg-[var(--color-gold)]",
  busy: "bg-[var(--color-error)]",
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, size = "md", status, className }, ref) => {
    const [imgError, setImgError] = useState(false);

    const initials = fallback
      ? fallback
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

    const showFallback = !src || imgError;

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex shrink-0", className)}
        data-state={showFallback ? "fallback" : "loaded"}
      >
        {showFallback ? (
          <div
            className={cn(
              "flex items-center justify-center rounded-full",
              "bg-[var(--color-mist)] text-[var(--color-ink)] font-[var(--font-heading)] font-bold",
              sizeClasses[size]
            )}
            aria-label={fallback || "Avatar"}
          >
            {initials}
          </div>
        ) : (
          <Image
            src={src}
            alt={alt || fallback || "Avatar"}
            width={size === "xs" ? 24 : size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 64}
            height={size === "xs" ? 24 : size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 64}
            className="rounded-full object-cover"
            onError={() => setImgError(true)}
            unoptimized
          />
        )}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-2 border-[var(--color-surface-raised)]",
              statusColors[status],
              size === "xs" && "w-2 h-2",
              size === "sm" && "w-2.5 h-2.5",
              size === "md" && "w-3 h-3",
              size === "lg" && "w-3.5 h-3.5",
              size === "xl" && "w-4 h-4"
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

function AvatarGroup({ children, max = 3, size = "md", className }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visible = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((child, i) => (
        <div key={i} className="relative ring-2 ring-[var(--color-surface-raised)] rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-[var(--color-mist)] text-[var(--color-ink)] font-[var(--font-heading)] font-bold ring-2 ring-[var(--color-surface-raised)]",
            sizeClasses[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup };
