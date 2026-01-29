'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoriesShowcaseProps {
    categories: Category[];
}

// Category icons/images mapping
const categoryImages: Record<string, string> = {
    'Áo': 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400&h=400&fit=crop',
    'Quần': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop',
    'Váy': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    'Phụ kiện': 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop',
    'Giày': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'Túi xách': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
};

const categoryColors: Record<string, string> = {
    'Áo': 'from-blue-500 to-blue-600',
    'Quần': 'from-emerald-500 to-emerald-600',
    'Váy': 'from-pink-500 to-pink-600',
    'Phụ kiện': 'from-amber-500 to-amber-600',
    'Giày': 'from-purple-500 to-purple-600',
    'Túi xách': 'from-rose-500 to-rose-600',
};

export default function CategoriesShowcase({ categories }: CategoriesShowcaseProps) {
    if (categories.length === 0) return null;

    // Featured category (first one) and rest
    const [featured, ...rest] = categories.slice(0, 5);

    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Danh Mục Sản Phẩm
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Khám phá các bộ sưu tập theo phong cách của bạn
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                    >
                        Xem tất cả
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                    {/* Featured Category - Larger */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="col-span-2 row-span-2"
                    >
                        <Link
                            href={`/products?category=${featured.id}`}
                            className="group relative block h-full min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{
                                    backgroundImage: `url(${categoryImages[featured.name] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop'})`,
                                }}
                            />
                            {/* Gradient Overlay */}
                            <div className={cn(
                                'absolute inset-0 bg-gradient-to-t opacity-80',
                                categoryColors[featured.name] || 'from-gray-800 to-gray-900'
                            )} />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                            {/* Content */}
                            <div className="relative h-full p-6 md:p-8 flex flex-col justify-end text-white">
                                <span className="text-sm font-medium opacity-80 mb-2">
                                    Bộ sưu tập nổi bật
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                                    {featured.name}
                                </h3>
                                <p className="text-white/80 mb-4 line-clamp-2">
                                    {featured.description || 'Khám phá ngay bộ sưu tập mới nhất'}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all">
                                    Xem ngay
                                    <FiArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Other Categories */}
                    {rest.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="col-span-1"
                        >
                            <Link
                                href={`/products?category=${category.id}`}
                                className="group relative block aspect-square rounded-2xl overflow-hidden"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{
                                        backgroundImage: `url(${categoryImages[category.name] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop'})`,
                                    }}
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                {/* Icon Circle */}
                                <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <FiShoppingBag className="w-5 h-5 text-white" />
                                </div>

                                {/* Content */}
                                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                    <h3 className="font-bold text-lg group-hover:text-accent-300 transition-colors">
                                        {category.name}
                                    </h3>
                                </div>

                                {/* Hover arrow */}
                                <div className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                    <FiArrowRight className="w-4 h-4 text-gray-900" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-6 text-center md:hidden">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-primary-600 font-semibold"
                    >
                        Xem tất cả danh mục
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
