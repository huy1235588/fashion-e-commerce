'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiZap, FiClock } from 'react-icons/fi';
import ProductCard from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface FlashSaleProps {
    products: Product[];
    endTime?: Date;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(endTime: Date): TimeLeft {
    const difference = endTime.getTime() - new Date().getTime();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                        {value.toString().padStart(2, '0')}
                    </span>
                </div>
                {/* Decorative dots */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-1">
                    <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
                </div>
            </div>
            <span className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-medium">
                {label}
            </span>
        </div>
    );
}

export default function FlashSale({ products, endTime }: FlashSaleProps) {
    // Default to 24 hours from now if no endTime provided
    const [targetDate] = useState(() => endTime || new Date(Date.now() + 24 * 60 * 60 * 1000));
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    // Don't render timer until mounted (avoid hydration mismatch)
    if (!mounted) {
        return null;
    }

    const isExpired = 
        timeLeft.days === 0 && 
        timeLeft.hours === 0 && 
        timeLeft.minutes === 0 && 
        timeLeft.seconds === 0;

    if (isExpired || products.length === 0) {
        return null;
    }

    // Only show products with discounts
    const saleProducts = products.filter(p => p.discount_price && p.discount_price < p.price);

    if (saleProducts.length === 0) {
        return null;
    }

    return (
        <section className="py-12 md:py-16 bg-gradient-to-br from-accent-50 via-white to-primary-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, -10, 10, 0]
                            }}
                            transition={{ 
                                duration: 0.5, 
                                repeat: Infinity, 
                                repeatDelay: 2 
                            }}
                            className="w-14 h-14 bg-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/30"
                        >
                            <FiZap className="w-7 h-7 text-white" />
                        </motion.div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Flash Sale
                            </h2>
                            <p className="text-gray-600 flex items-center gap-2">
                                <FiClock className="w-4 h-4" />
                                Kết thúc sau
                            </p>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <CountdownUnit value={timeLeft.days} label="Ngày" />
                        <CountdownUnit value={timeLeft.hours} label="Giờ" />
                        <CountdownUnit value={timeLeft.minutes} label="Phút" />
                        <CountdownUnit value={timeLeft.seconds} label="Giây" />
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {saleProducts.slice(0, 4).map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                <div className="mt-10 text-center">
                    <Link
                        href="/products?sale=true"
                        className={cn(
                            'inline-flex items-center gap-2 px-8 py-3',
                            'bg-accent-500 text-white font-semibold rounded-xl',
                            'hover:bg-accent-600 transition-colors',
                            'shadow-lg shadow-accent-500/30'
                        )}
                    >
                        <FiZap className="w-5 h-5" />
                        Xem tất cả sản phẩm giảm giá
                    </Link>
                </div>
            </div>
        </section>
    );
}
