/* Hallmark · component: date-picker · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · open · selected
 */
"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "./button";

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  error?: string;
  hint?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  placeholder?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      hint,
      minDate,
      maxDate,
      disabled = false,
      placeholder = "Select date",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState(value || new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const handleSelect = useCallback(
      (day: number) => {
        const selected = new Date(year, month, day);
        selected.setHours(0, 0, 0, 0);

        if (minDate && selected < minDate) return;
        if (maxDate && selected > maxDate) return;

        onChange?.(selected);
        setOpen(false);
      },
      [year, month, minDate, maxDate, onChange]
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isDisabled = (day: number) => {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return false;
    };

    const hasError = !!error;

    return (
      <div ref={ref || containerRef} className="w-full relative">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          data-state={open ? "open" : "closed"}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2.5",
            "border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-raised)] text-left",
            "transition-all duration-200 ease-[var(--ease-out-expo)]",
            "min-h-[44px] cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-focus-ring)]",
            "hover:border-[var(--color-border-strong)]",
            disabled && "opacity-50 cursor-not-allowed bg-[var(--color-surface-sunken)]",
            hasError && "border-[var(--color-error)] focus:ring-[var(--color-error)]"
          )}
        >
          <span className={cn(!value && "text-[var(--color-slate)]/50")}>
            {value ? formatDateDisplay(value) : placeholder}
          </span>
          <Calendar size={16} className="text-[var(--color-slate)] shrink-0 ml-2" />
        </button>

        {open && (
          <div
            className={cn(
              "absolute z-50 mt-1 bg-[var(--color-surface-raised)] border border-[var(--color-border)]",
              "rounded-lg shadow-lg p-3 w-[280px]",
              "animate-in fade-in-0 slide-in-from-top-1 duration-150"
            )}
          >
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1))}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-sunken)] transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-[var(--font-heading)] font-bold text-[var(--color-ink)]">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1))}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-[var(--color-surface-sunken)] transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-[var(--font-mono)] text-[var(--color-slate)] py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(year, month, day);
                date.setHours(0, 0, 0, 0);
                const isSelected = value?.getTime() === date.getTime();
                const isToday = today.getTime() === date.getTime();
                const disabled = isDisabled(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelect(day)}
                    disabled={disabled}
                    data-state={isSelected ? "selected" : isToday ? "today" : "default"}
                    className={cn(
                      "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-sm",
                      "transition-all duration-150 cursor-pointer",
                      isSelected && "bg-[var(--color-forest)] text-[var(--color-bone)] font-bold",
                      !isSelected && isToday && "border border-[var(--color-gold)] text-[var(--color-forest)] font-bold",
                      !isSelected && !isToday && !disabled && "hover:bg-[var(--color-surface-sunken)] text-[var(--color-ink)]",
                      disabled && "opacity-30 cursor-not-allowed"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between mt-3 pt-2 border-t border-[var(--color-border)]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange?.(null);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewDate(new Date());
                }}
              >
                Today
              </Button>
            </div>
          </div>
        )}
        {hint && !hasError && (
          <p className="mt-1 text-xs text-[var(--color-slate)]">{hint}</p>
        )}
        {hasError && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
