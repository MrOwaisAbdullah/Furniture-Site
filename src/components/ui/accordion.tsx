/* Hallmark · component: accordion · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · open · closed
 */
"use client";

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionContextType {
  expandedItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx)
    throw new Error(
      "Accordion compound components must be used within <Accordion>"
    );
  return ctx;
}

interface AccordionItemContextType {
  value: string;
}

const AccordionItemContext = createContext<AccordionItemContextType | null>(
  null
);

function useAccordionItem() {
  const ctx = useContext(AccordionItemContext);
  if (!ctx)
    throw new Error(
      "AccordionTrigger/Content must be used within <AccordionItem>"
    );
  return ctx;
}

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  children: ReactNode;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      defaultValue = [],
      value,
      onValueChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
      new Set(defaultValue)
    );
    const expandedItems = value ? new Set(value) : internalExpanded;

    const toggle = (item: string) => {
      const newSet = new Set(expandedItems);
      if (type === "single") {
        newSet.clear();
      }
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      setInternalExpanded(newSet);
      onValueChange?.(Array.from(newSet));
    };

    return (
      <AccordionContext.Provider value={{ expandedItems, toggle }}>
        <div
          ref={ref}
          className={cn("w-full divide-y divide-[var(--color-border)]", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, children, className, ...props }, ref) => {
    const { expandedItems } = useAccordion();
    const isExpanded = expandedItems.has(value);

    return (
      <AccordionItemContext.Provider value={{ value }}>
        <div
          ref={ref}
          className={cn("py-0", className)}
          data-state={isExpanded ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => {
    const { expandedItems, toggle } = useAccordion();
    const { value } = useAccordionItem();
    const isExpanded = expandedItems.has(value);

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => toggle(value)}
        aria-expanded={isExpanded}
        data-state={isExpanded ? "open" : "closed"}
        className={cn(
          "flex items-center justify-between w-full py-4 px-1 text-left min-h-[44px]",
          "font-medium text-[var(--color-ink)]",
          "transition-colors duration-200 cursor-pointer",
          "hover:text-[var(--color-forest)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          size={16}
          className={cn(
            "text-[var(--color-slate)] transition-transform duration-200 shrink-0 ml-2",
            isExpanded && "rotate-180"
          )}
        />
      </button>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, ref) => {
    const { expandedItems } = useAccordion();
    const { value } = useAccordionItem();
    const isExpanded = expandedItems.has(value);

    if (!isExpanded) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "pb-4 px-1 text-sm text-[var(--color-slate)]",
          "animate-in slide-in-from-top-1 fade-in-0 duration-200",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
