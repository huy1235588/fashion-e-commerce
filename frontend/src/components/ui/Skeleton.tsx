'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'circular' | 'text';
    width?: string | number;
    height?: string | number;
}

function Skeleton({
    className,
    variant = 'default',
    width,
    height,
    style,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-gray-200',
                variant === 'circular' && 'rounded-full',
                variant === 'text' && 'rounded h-4',
                variant === 'default' && 'rounded-lg',
                className
            )}
            style={{
                width: width,
                height: height,
                ...style,
            }}
            {...props}
        />
    );
}

// Pre-built skeleton components
function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-3', className)}>
            <Skeleton className="h-48 w-full" />
            <Skeleton variant="text" className="h-4 w-3/4" />
            <Skeleton variant="text" className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton variant="text" className="h-5 w-24" />
                <Skeleton variant="text" className="h-5 w-16" />
            </div>
        </div>
    );
}

function SkeletonProductCard({ className }: { className?: string }) {
    return (
        <div className={cn('bg-white rounded-xl overflow-hidden shadow-sm', className)}>
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton variant="text" className="h-5 w-full" />
                <Skeleton variant="text" className="h-4 w-2/3" />
                <div className="flex items-center gap-2">
                    <Skeleton variant="text" className="h-4 w-16" />
                    <Skeleton variant="text" className="h-3 w-12" />
                </div>
                <div className="flex justify-between items-center pt-1">
                    <Skeleton variant="text" className="h-6 w-24" />
                    <Skeleton variant="circular" className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}

function SkeletonProductGrid({ count = 8, className }: { count?: number; className?: string }) {
    return (
        <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonProductCard key={i} />
            ))}
        </div>
    );
}

function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
    return (
        <div className={cn('space-y-3', className)}>
            {/* Header */}
            <div className="flex gap-4 pb-2 border-b">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} variant="text" className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 py-2">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            variant="text"
                            className="h-4 flex-1"
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

function SkeletonStats({ className }: { className?: string }) {
    return (
        <div className={cn('bg-white rounded-xl p-6 shadow-sm', className)}>
            <div className="flex items-center justify-between mb-2">
                <Skeleton variant="text" className="h-4 w-24" />
                <Skeleton variant="circular" className="h-8 w-8" />
            </div>
            <Skeleton variant="text" className="h-8 w-32 mb-1" />
            <Skeleton variant="text" className="h-3 w-20" />
        </div>
    );
}

function SkeletonAvatar({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
    const sizes = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-14 w-14',
    };
    
    return (
        <Skeleton variant="circular" className={cn(sizes[size], className)} />
    );
}

export {
    Skeleton,
    SkeletonCard,
    SkeletonProductCard,
    SkeletonProductGrid,
    SkeletonTable,
    SkeletonStats,
    SkeletonAvatar,
};
