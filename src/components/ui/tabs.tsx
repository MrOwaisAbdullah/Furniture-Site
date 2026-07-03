/* Hallmark · component: tabs · genre: editorial · theme: Yousuf Living
 * states: default · hover · focus · active · disabled
 */
"use client";

import { forwardRef, createContext, useContext, useState, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs compound components must be used within <Tabs>");
  return ctx;
}

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, children, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const activeTab = value ?? internalValue;

    const setActiveTab = (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
    };

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

type TabsListProps = HTMLAttributes<HTMLDivElement>;

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "flex gap-1 p-1 bg-[var(--color-surface-sunken)] rounded-lg overflow-x-auto",
        "scrollbar-none",
        className
      )}
      {...props}
    />
  )
);

TabsList.displayName = "TabsList";

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, disabled = false, className, ...props }, ref) => {
    const { activeTab, setActiveTab } = useTabs();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        disabled={disabled}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => setActiveTab(value)}
        className={cn(
          "flex-1 min-h-[44px] px-4 py-2 text-sm font-medium rounded-md",
          "transition-all duration-200 ease-[var(--ease-out-expo)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2",
          "cursor-pointer select-none",
          isActive
            ? "bg-[var(--color-surface-raised)] text-[var(--color-forest)] shadow-sm"
            : "text-[var(--color-slate)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-raised)]/50",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, ...props }, ref) => {
    const { activeTab } = useTabs();
    if (activeTab !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          "mt-[var(--space-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]",
          "animate-in fade-in-0 slide-in-from-bottom-1 duration-200",
          className
        )}
        tabIndex={0}
        {...props}
      />
    );
  }
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
