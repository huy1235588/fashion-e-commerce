'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    FiShoppingBag, 
    FiPackage, 
    FiSearch, 
    FiHeart, 
    FiShoppingCart,
    FiMapPin,
    FiFileText,
    FiUsers
} from 'react-icons/fi';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

type EmptyStateType = 
    | 'cart' 
    | 'wishlist' 
    | 'orders' 
    | 'search' 
    | 'products' 
    | 'addresses'
    | 'reviews'
    | 'users';

interface EmptyStateProps {
    type: EmptyStateType;
    title?: string;
    description?: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
}

const emptyStateConfig: Record<EmptyStateType, {
    icon: typeof FiShoppingBag;
    defaultTitle: string;
    defaultDescription: string;
    iconColor: string;
    iconBgColor: string;
}> = {
    cart: {
        icon: FiShoppingCart,
        defaultTitle: 'Giỏ hàng trống',
        defaultDescription: 'Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!',
        iconColor: 'text-primary-500',
        iconBgColor: 'bg-primary-100',
    },
    wishlist: {
        icon: FiHeart,
        defaultTitle: 'Chưa có sản phẩm yêu thích',
        defaultDescription: 'Hãy thêm các sản phẩm bạn yêu thích để dễ dàng theo dõi và mua sắm sau.',
        iconColor: 'text-error-500',
        iconBgColor: 'bg-error-100',
    },
    orders: {
        icon: FiPackage,
        defaultTitle: 'Chưa có đơn hàng',
        defaultDescription: 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!',
        iconColor: 'text-accent-500',
        iconBgColor: 'bg-accent-100',
    },
    search: {
        icon: FiSearch,
        defaultTitle: 'Không tìm thấy kết quả',
        defaultDescription: 'Không có sản phẩm nào phù hợp với tìm kiếm của bạn. Hãy thử với từ khóa khác.',
        iconColor: 'text-gray-500',
        iconBgColor: 'bg-gray-100',
    },
    products: {
        icon: FiShoppingBag,
        defaultTitle: 'Không có sản phẩm',
        defaultDescription: 'Danh mục này chưa có sản phẩm nào. Hãy quay lại sau nhé!',
        iconColor: 'text-primary-500',
        iconBgColor: 'bg-primary-100',
    },
    addresses: {
        icon: FiMapPin,
        defaultTitle: 'Chưa có địa chỉ',
        defaultDescription: 'Bạn chưa lưu địa chỉ nào. Thêm địa chỉ để thanh toán nhanh hơn.',
        iconColor: 'text-success-500',
        iconBgColor: 'bg-success-100',
    },
    reviews: {
        icon: FiFileText,
        defaultTitle: 'Chưa có đánh giá',
        defaultDescription: 'Sản phẩm này chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!',
        iconColor: 'text-warning-500',
        iconBgColor: 'bg-warning-100',
    },
    users: {
        icon: FiUsers,
        defaultTitle: 'Không có người dùng',
        defaultDescription: 'Chưa có người dùng nào phù hợp với bộ lọc.',
        iconColor: 'text-purple-500',
        iconBgColor: 'bg-purple-100',
    },
};

export default function EmptyState({
    type,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    const config = emptyStateConfig[type];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex flex-col items-center justify-center text-center py-12 px-4',
                className
            )}
        >
            <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className={cn(
                    'w-24 h-24 rounded-full flex items-center justify-center mb-6',
                    config.iconBgColor
                )}
            >
                <Icon className={cn('w-12 h-12', config.iconColor)} />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-gray-900 mb-2"
            >
                {title || config.defaultTitle}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-6 max-w-md"
            >
                {description || config.defaultDescription}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {action.href ? (
                        <Link href={action.href}>
                            <Button>{action.label}</Button>
                        </Link>
                    ) : (
                        <Button onClick={action.onClick}>{action.label}</Button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}
