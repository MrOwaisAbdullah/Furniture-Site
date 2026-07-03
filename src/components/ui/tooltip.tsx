/* Hallmark · component: tooltip · genre: editorial · theme: Yousuf Living
 * states: default · visible
 */
"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    { content, side = "top", delayMs = 300, children, className, ...props },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const show = () => {
      timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
    };

    const hide = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setVisible(false);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex", className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        {...props}
      >
        <div className="inline-flex">{children}</div>
        {visible && (
          <div
            role="tooltip"
            className={cn(
              "absolute z-50 px-3 py-1.5 text-xs text-[var(--color-bone)] bg-[var(--color-ink)] rounded-lg shadow-lg",
              "whitespace-nowrap pointer-events-none",
              "animate-in fade-in-0 zoom-in-95 duration-150",
              positionClasses[side]
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };
