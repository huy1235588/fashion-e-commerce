'use client';

import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { cn, formatCurrency } from '@/lib/utils';
import type { IconType } from 'react-icons';

interface StatsCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: IconType;
    iconColor?: string;
    iconBgColor?: string;
    trend?: {
        value: number;
        type: 'up' | 'down' | 'neutral';
    };
    formatAsCurrency?: boolean;
    delay?: number;
}

export default function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = 'text-primary-600',
    iconBgColor = 'bg-primary-100',
    trend,
    formatAsCurrency = false,
    delay = 0,
}: StatsCardProps) {
    const formattedValue = formatAsCurrency 
        ? formatCurrency(typeof value === 'number' ? value : parseFloat(value as string))
        : typeof value === 'number' 
            ? value.toLocaleString('vi-VN')
            : value;

    const TrendIcon = trend?.type === 'up' 
        ? FiTrendingUp 
        : trend?.type === 'down' 
            ? FiTrendingDown 
            : FiMinus;

    const trendColor = trend?.type === 'up'
        ? 'text-success-600 bg-success-50'
        : trend?.type === 'down'
            ? 'text-error-600 bg-error-50'
            : 'text-gray-600 bg-gray-100';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    iconBgColor
                )}>
                    <Icon className={cn('w-6 h-6', iconColor)} />
                </div>
                {trend && (
                    <div className={cn(
                        'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
                        trendColor
                    )}>
                        <TrendIcon className="w-3 h-3" />
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
                {subtitle && (
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                )}
            </div>
        </motion.div>
    );
}
