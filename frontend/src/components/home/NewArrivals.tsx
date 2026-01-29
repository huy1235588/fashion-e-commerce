'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPackage } from 'react-icons/fi';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types';

interface NewArrivalsProps {
    products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
    if (products.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-3"
                        >
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                <FiPackage className="w-5 h-5 text-primary-600" />
                            </div>
                            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                                Mới nhất
                            </span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-3xl font-bold text-gray-900"
                        >
                            Sản Phẩm Mới Về
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 mt-1"
                        >
                            Khám phá những mẫu mới nhất vừa cập nhật
                        </motion.p>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/products?sort=newest"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
                        >
                            Xem tất cả
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.slice(0, 8).map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
