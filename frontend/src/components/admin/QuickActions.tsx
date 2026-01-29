'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiPackage, FiUsers, FiArrowRight } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface QuickAction {
    title: string;
    description: string;
    icon: typeof FiShoppingCart;
    href: string;
    color: string;
    bgColor: string;
}

const actions: QuickAction[] = [
    {
        title: 'Quản Lý Đơn Hàng',
        description: 'Xem và xử lý đơn hàng mới',
        icon: FiShoppingCart,
        href: '/admin/orders',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        title: 'Quản Lý Sản Phẩm',
        description: 'Thêm, sửa, xóa sản phẩm',
        icon: FiPackage,
        href: '/admin/products',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
    },
    {
        title: 'Quản Lý Người Dùng',
        description: 'Xem danh sách khách hàng',
        icon: FiUsers,
        href: '/admin/users',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
];

export default function QuickActions() {
    const router = useRouter();

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản Lý Nhanh</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => router.push(action.href)}
                            className="group p-5 border-2 border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/50 transition-all text-left"
                        >
                            <div className={cn(
                                'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                                action.bgColor
                            )}>
                                <Icon className={cn('w-6 h-6', action.color)} />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                                {action.title}
                            </h4>
                            <p className="text-sm text-gray-500 mb-3">
                                {action.description}
                            </p>
                            <span className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Truy cập
                                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
