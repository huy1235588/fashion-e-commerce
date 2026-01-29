'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-gray-100 text-gray-800',
                primary: 'bg-primary-100 text-primary-800',
                secondary: 'bg-gray-500 text-white',
                success: 'bg-success-100 text-success-800',
                warning: 'bg-warning-100 text-warning-800',
                error: 'bg-error-100 text-error-800',
                info: 'bg-primary-100 text-primary-800',
                accent: 'bg-accent-100 text-accent-800',
                outline: 'border border-current bg-transparent',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs rounded',
                md: 'px-2.5 py-0.5 text-sm rounded-md',
                lg: 'px-3 py-1 text-sm rounded-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {
    dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {dot && (
                <span
                    className={cn(
                        'mr-1.5 h-1.5 w-1.5 rounded-full',
                        variant === 'success' && 'bg-success-500',
                        variant === 'warning' && 'bg-warning-500',
                        variant === 'error' && 'bg-error-500',
                        variant === 'info' && 'bg-primary-500',
                        variant === 'primary' && 'bg-primary-500',
                        (!variant || variant === 'default') && 'bg-gray-500'
                    )}
                />
            )}
            {children}
        </span>
    );
}

export { Badge, badgeVariants };
