/* Hallmark · component: toast · genre: editorial · theme: Yousuf Living
 * states: default · enter · exit · success · error · info
 */
"use client";

import {
  forwardRef,
  useState,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-20 left-4 right-4 z-[60] flex flex-col gap-2 md:bottom-4 md:left-auto md:right-4 md:w-80"
      >
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onClose={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const ToastItem = forwardRef<HTMLDivElement, { toast: Toast; onClose: () => void }>(
  ({ toast, onClose }, ref) => {
    const Icon = icons[toast.type];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg shadow-lg text-sm",
          "animate-in slide-in-from-bottom-5 fade-in-0 duration-300",
          toast.type === "success" && "bg-[var(--color-forest)] text-[var(--color-bone)]",
          toast.type === "error" && "bg-[var(--color-error)] text-white",
          toast.type === "info" && "bg-[var(--color-ink)] text-[var(--color-bone)]"
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    );
  }
);

ToastItem.displayName = "ToastItem";
