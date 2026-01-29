'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('bg-white border border-gray-200 overflow-hidden', {
    variants: {
        variant: {
            default: 'shadow-sm',
            elevated: 'shadow-md',
            outline: 'shadow-none',
            ghost: 'border-transparent shadow-none bg-transparent',
        },
        rounded: {
            none: 'rounded-none',
            sm: 'rounded-md',
            md: 'rounded-lg',
            lg: 'rounded-xl',
            xl: 'rounded-2xl',
        },
        padding: {
            none: 'p-0',
            sm: 'p-3',
            md: 'p-4',
            lg: 'p-6',
            xl: 'p-8',
        },
        hover: {
            true: 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
            false: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        rounded: 'lg',
        padding: 'md',
        hover: false,
    },
});

export interface CardProps
    extends HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, rounded, padding, hover, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(cardVariants({ variant, rounded, padding, hover }), className)}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

// Card subcomponents
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 p-4 pb-0', className)}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-lg font-semibold text-gray-900 leading-tight', className)}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-gray-500', className)}
            {...props}
        />
    )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('p-4', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center p-4 pt-0', className)}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };
