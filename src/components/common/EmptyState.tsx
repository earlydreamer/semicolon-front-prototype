/**
 * 공통 Empty State 컴포넌트
 */

import type { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {Icon && (
        <div className="bg-neutral-100 p-4 rounded-full mb-4">
          <Icon className="w-8 h-8 text-neutral-400" />
        </div>
      )}
      {title && <h3 className="text-lg font-bold text-neutral-900 mb-1">{title}</h3>}
      <p className="text-neutral-500 max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
