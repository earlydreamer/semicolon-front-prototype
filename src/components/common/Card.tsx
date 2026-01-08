import * as React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-200",
          
          // Variants
          variant === 'elevated' && "bg-neutral-0 shadow-sm border border-neutral-100",
          variant === 'outlined' && "bg-neutral-0 border border-neutral-200",
          variant === 'filled' && "bg-neutral-50 border border-transparent",

          // Interactive
          interactive && "hover:shadow-md hover:-translate-y-1 cursor-pointer active:scale-[0.99]",
          
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

export { Card };
