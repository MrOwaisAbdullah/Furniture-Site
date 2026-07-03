/* Hallmark · component: radio-group · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled · selected
 */
"use client";

import {
  forwardRef,
  createContext,
  useContext,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextType {
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType | null>(null);

function useRadioGroup() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx)
    throw new Error(
      "RadioGroup compound components must be used within <RadioGroup>"
    );
  return ctx;
}

interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  hint?: string;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      onChange,
      name,
      disabled = false,
      label,
      error,
      hint,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <RadioGroupContext.Provider
        value={{ value, onChange, name, disabled }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-label={label}
          aria-invalid={!!error}
          className={cn("w-full", className)}
          {...props}
        >
          {label && (
            <span className="block text-sm font-medium text-[var(--color-ink)] mb-2">
              {label}
            </span>
          )}
          <div className="flex flex-col gap-2">{children}</div>
          {hint && !error && (
            <p className="mt-1 text-xs text-[var(--color-slate)]">{hint}</p>
          )}
          {error && (
            <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
          )}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps
  extends Omit<HTMLAttributes<HTMLLabelElement>, "onChange"> {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

const RadioGroupItem = forwardRef<HTMLLabelElement, RadioGroupItemProps>(
  (
    {
      value: itemValue,
      label,
      description,
      disabled: itemDisabled,
      className,
      ...props
    },
    ref
  ) => {
    const {
      value,
      onChange,
      name,
      disabled: groupDisabled,
    } = useRadioGroup();
    const disabled = groupDisabled || itemDisabled;
    const checked = value === itemValue;

    return (
      <label
        ref={ref}
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg min-h-[44px]",
          "border transition-all duration-200 ease-[var(--ease-out-expo)]",
          "cursor-pointer",
          checked
            ? "border-[var(--color-forest)] bg-[var(--color-forest)]/5"
            : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]",
          disabled && "opacity-50 cursor-not-allowed bg-[var(--color-surface-sunken)]",
          className
        )}
        {...props}
      >
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            type="radio"
            name={name}
            value={itemValue}
            checked={checked}
            disabled={disabled}
            onChange={() => onChange?.(itemValue)}
            className="sr-only"
          />
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              checked ? "border-[var(--color-forest)]" : "border-[var(--color-border-strong)]"
            )}
          >
            {checked && (
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-forest)]" />
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-[var(--color-ink)]">
            {label}
          </span>
          {description && (
            <p className="text-xs text-[var(--color-slate)] mt-0.5">
              {description}
            </p>
          )}
        </div>
      </label>
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
