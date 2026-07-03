/* Hallmark · component: modal · genre: editorial · theme: Yousuf Living
 * states: default · open · close
 */
"use client";

import { forwardRef, type HTMLAttributes, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ open, onClose, title, description, children, size = "md", className, ...props }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (open) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        previousActiveElement.current?.focus();
      }

      return () => {
        document.body.style.overflow = "";
      };
    }, [open]);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      if (open) {
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-[var(--space-4)]",
          "bg-[var(--color-ink)]/50 backdrop-blur-sm",
          "animate-in fade-in-0 duration-200"
        )}
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          aria-describedby={description ? "modal-description" : undefined}
          className={cn(
            "bg-[var(--color-surface-raised)] rounded-xl shadow-2xl w-full overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            size === "sm" && "max-w-sm",
            size === "md" && "max-w-md",
            size === "lg" && "max-w-lg",
            className
          )}
          {...props}
        >
          {(title || description) && (
            <div className="px-[var(--space-6)] pt-[var(--space-6)] pb-0">
              {title && (
                <h2 className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-ink)]">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-[var(--color-slate)]">
                  {description}
                </p>
              )}
            </div>
          )}
          <div className="px-[var(--space-6)] py-[var(--space-6)]">{children}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className={cn(
              "absolute top-[var(--space-4)] right-[var(--space-4)]",
              "min-w-[44px] min-h-[44px] flex items-center justify-center",
              "rounded-full text-[var(--color-slate)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-sunken)]",
              "transition-colors duration-200 cursor-pointer"
            )}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1 mb-[var(--space-4)]", className)}
      {...props}
    />
  )
);

ModalHeader.displayName = "ModalHeader";

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex justify-end gap-2 pt-[var(--space-4)] border-t border-[var(--color-border)]",
        className
      )}
      {...props}
    />
  )
);

ModalFooter.displayName = "ModalFooter";

export { Modal, ModalHeader, ModalFooter };
