import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, showLabel = false, className, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm text-slate mb-1">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div ref={ref} className="h-2 bg-mist rounded-full overflow-hidden">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
