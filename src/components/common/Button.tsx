import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import { cn } from '@/utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          // ... (styles remain same)
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-neutral-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          
          // Variants
          variant === 'primary' && "bg-primary-500 text-neutral-0 hover:bg-primary-600 active:scale-95",
          variant === 'secondary' && "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:scale-95",
          variant === 'outline' && "border border-primary-500 bg-neutral-0 text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:scale-95",
          variant === 'ghost' && "hover:bg-neutral-100 hover:text-neutral-900 active:scale-95",
          variant === 'danger' && "bg-error-500 text-neutral-0 hover:bg-error-600 active:scale-95",
          
          // Sizes
          size === 'sm' && "h-9 px-3 rounded-md text-xs",
          size === 'md' && "h-11 px-4 py-2 rounded-lg",
          size === 'lg' && "h-14 px-8 rounded-lg text-lg",
          size === 'icon' && "h-11 w-11",

          className
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {asChild ? children : (
          <>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : leftIcon ? (
              <span className="mr-2">{leftIcon}</span>
            ) : null}
            
            {children}

            {!isLoading && rightIcon && (
              <span className="ml-2">{rightIcon}</span>
            )}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
