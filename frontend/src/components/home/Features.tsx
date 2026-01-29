'use client';

import { motion } from 'framer-motion';
import { FiTruck, FiRefreshCw, FiShield, FiHeadphones, FiGift, FiCreditCard } from 'react-icons/fi';

const features = [
    {
        icon: FiTruck,
        title: 'Giao Hàng Nhanh',
        description: 'Giao hàng toàn quốc trong 2-3 ngày',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        icon: FiRefreshCw,
        title: 'Đổi Trả Dễ Dàng',
        description: 'Đổi trả miễn phí trong 7 ngày',
        color: 'bg-emerald-100 text-emerald-600',
    },
    {
        icon: FiShield,
        title: 'Cam Kết Chính Hãng',
        description: '100% sản phẩm chính hãng',
        color: 'bg-purple-100 text-purple-600',
    },
    {
        icon: FiHeadphones,
        title: 'Hỗ Trợ 24/7',
        description: 'Tư vấn nhiệt tình, chuyên nghiệp',
        color: 'bg-orange-100 text-orange-600',
    },
    {
        icon: FiGift,
        title: 'Ưu Đãi Thành Viên',
        description: 'Giảm giá đặc biệt cho thành viên',
        color: 'bg-pink-100 text-pink-600',
    },
    {
        icon: FiCreditCard,
        title: 'Thanh Toán An Toàn',
        description: 'Nhiều phương thức thanh toán',
        color: 'bg-cyan-100 text-cyan-600',
    },
];

export default function Features() {
    return (
        <section className="py-12 md:py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                    >
                        Tại Sao Chọn Chúng Tôi
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho bạn
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-shadow border border-gray-100 group"
                            >
                                <div className={`w-14 h-14 mx-auto mb-4 ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                                    {feature.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
