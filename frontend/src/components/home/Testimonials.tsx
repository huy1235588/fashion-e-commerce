'use client';

import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { BiSolidQuoteAltLeft } from 'react-icons/bi';
import { cn } from '@/lib/utils';

interface Testimonial {
    id: number;
    name: string;
    avatar: string;
    role: string;
    content: string;
    rating: number;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Nguyễn Thị Mai',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        role: 'Khách hàng thân thiết',
        content: 'Sản phẩm chất lượng tuyệt vời, đúng như hình ảnh. Giao hàng nhanh và đóng gói cẩn thận. Tôi rất hài lòng!',
        rating: 5,
    },
    {
        id: 2,
        name: 'Trần Văn Minh',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        role: 'Khách hàng mới',
        content: 'Lần đầu mua hàng ở đây và rất ấn tượng. Chất vải mềm mại, form áo đẹp, giá cả hợp lý.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Lê Hoàng Anh',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        role: 'Khách hàng VIP',
        content: 'Đã mua sắm ở đây hơn 2 năm. Luôn tin tưởng vào chất lượng sản phẩm và dịch vụ chăm sóc khách hàng.',
        rating: 5,
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <FiStar
                    key={i}
                    className={cn(
                        'w-4 h-4',
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    )}
                />
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                    >
                        Khách Hàng Nói Gì Về Chúng Tôi
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        Hơn 10,000+ khách hàng đã tin tưởng và mua sắm tại cửa hàng của chúng tôi
                    </motion.p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            {/* Quote Icon */}
                            <div className="absolute -top-4 left-6">
                                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                                    <BiSolidQuoteAltLeft className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-4">
                                {/* Rating */}
                                <div className="mb-4">
                                    <StarRating rating={testimonial.rating} />
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {testimonial.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                10K+
                            </div>
                            <p className="text-primary-100">Khách hàng</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                50K+
                            </div>
                            <p className="text-primary-100">Đơn hàng</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                4.9
                            </div>
                            <p className="text-primary-100">Đánh giá trung bình</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                99%
                            </div>
                            <p className="text-primary-100">Hài lòng</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
