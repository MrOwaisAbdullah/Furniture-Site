import { type ReactNode } from "react";
import { Package } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-mist rounded-full flex items-center justify-center mb-4">
        {icon || <Package className="w-8 h-8 text-slate" />}
      </div>
      <h3 className="font-heading text-lg font-bold text-ink mb-2">{title}</h3>
      <p className="text-slate mb-4 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
