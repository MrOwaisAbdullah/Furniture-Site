/* Hallmark · component: dropdown · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · open · selected
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
import { ChevronDown, Check } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  renderOption?: (option: DropdownOption) => ReactNode;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select...",
      label,
      error,
      disabled = false,
      renderOption,
      className,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          buttonRef.current &&
          !buttonRef.current.contains(e.target as Node) &&
          listRef.current &&
          !listRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (open && highlightedIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightedIndex] as HTMLElement;
        item?.scrollIntoView({ block: "nearest" });
      }
    }, [open, highlightedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (open && highlightedIndex >= 0) {
            const opt = options[highlightedIndex];
            if (opt && !opt.disabled) {
              onChange?.(opt.value);
              setOpen(false);
            }
          } else {
            setOpen(true);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            setOpen(true);
            setHighlightedIndex(0);
          } else {
            setHighlightedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Escape":
          setOpen(false);
          buttonRef.current?.focus();
          break;
      }
    };

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-[var(--color-ink)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => !disabled && setOpen(!open)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            data-state={open ? "open" : "closed"}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5",
              "border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-raised)] text-left",
              "transition-all duration-200 ease-[var(--ease-out-expo)]",
              "min-h-[44px] cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-focus-ring)]",
              "hover:border-[var(--color-border-strong)]",
              disabled && "opacity-50 cursor-not-allowed bg-[var(--color-surface-sunken)]",
              error && "border-[var(--color-error)] focus:ring-[var(--color-error)]"
            )}
          >
            <span
              className={cn(
                "truncate",
                !selected && "text-[var(--color-slate)]/50"
              )}
            >
              {selected
                ? renderOption
                  ? renderOption(selected)
                  : selected.label
                : placeholder}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                "ml-2 text-[var(--color-slate)] transition-transform duration-200 shrink-0",
                open && "rotate-180"
              )}
            />
          </button>

          {open && (
            <ul
              ref={listRef}
              role="listbox"
              className={cn(
                "absolute z-50 mt-1 w-full bg-[var(--color-surface-raised)] border border-[var(--color-border)]",
                "rounded-lg shadow-lg max-h-60 overflow-y-auto",
                "animate-in fade-in-0 slide-in-from-top-1 duration-150"
              )}
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value);
                      setOpen(false);
                    }
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 min-h-[44px]",
                    "transition-colors duration-100 cursor-pointer",
                    option.value === value && "bg-[var(--color-forest)]/5",
                    highlightedIndex === index && "bg-[var(--color-surface-sunken)]",
                    option.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="truncate">
                    {renderOption ? renderOption(option) : option.label}
                  </span>
                  {option.value === value && (
                    <Check size={16} className="text-[var(--color-forest)] shrink-0" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
export type { DropdownOption, DropdownProps };
