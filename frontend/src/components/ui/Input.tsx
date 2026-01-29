'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
    // Base styles
    'w-full border bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
    {
        variants: {
            variant: {
                default:
                    'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
                error:
                    'border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500/20',
                success:
                    'border-success-500 focus:border-success-500 focus:ring-2 focus:ring-success-500/20',
            },
            inputSize: {
                sm: 'h-8 px-3 text-sm rounded-md',
                md: 'h-10 px-4 text-sm rounded-lg',
                lg: 'h-12 px-4 text-base rounded-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            inputSize: 'md',
        },
    }
);

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
        VariantProps<typeof inputVariants> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            variant,
            inputSize,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            containerClassName,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
        const hasError = !!error;

        return (
            <div className={cn('space-y-1.5', containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        className={cn(
                            inputVariants({
                                variant: hasError ? 'error' : variant,
                                inputSize,
                            }),
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {(error || helperText) && (
                    <p
                        className={cn(
                            'text-sm',
                            hasError ? 'text-error-600' : 'text-gray-500'
                        )}
                    >
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input, inputVariants };
