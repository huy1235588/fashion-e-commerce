'use client';

import { OrderStatus } from '@/types/order';
import { FiClock, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    showProgress?: boolean;
}

const statusConfig = {
    pending: { label: 'Chờ xác nhận', icon: FiClock, color: 'text-yellow-600', bgColor: 'bg-yellow-50', progress: 25 },
    processing: { label: 'Đang xử lý', icon: FiPackage, color: 'text-blue-600', bgColor: 'bg-blue-50', progress: 50 },
    shipping: { label: 'Đang giao', icon: FiTruck, color: 'text-purple-600', bgColor: 'bg-purple-50', progress: 75 },
    delivered: { label: 'Đã giao', icon: FiCheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', progress: 100 },
    cancelled: { label: 'Đã hủy', icon: FiCheckCircle, color: 'text-red-600', bgColor: 'bg-red-50', progress: 0 },
};

export default function OrderStatusBadge({ status, showProgress = false }: OrderStatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    if (!showProgress) {
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                <Icon className="text-sm" />
                {config.label}
            </span>
        );
    }

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
                <span className={`flex items-center gap-1 font-medium ${config.color}`}>
                    <Icon />
                    {config.label}
                </span>
                {status !== 'cancelled' && (
                    <span className="text-gray-500">{config.progress}%</span>
                )}
            </div>
            {status !== 'cancelled' && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full transition-all ${status === 'delivered' ? 'bg-green-500' :
                                status === 'shipping' ? 'bg-purple-500' :
                                    status === 'processing' ? 'bg-blue-500' :
                                        'bg-yellow-500'
                            }`}
                        style={{ width: `${config.progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}
