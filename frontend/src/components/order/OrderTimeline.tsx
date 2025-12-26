'use client';

import { Order, OrderStatus } from '@/types/order';
import { FiClock, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface OrderTimelineProps {
    order: Order;
}

const statusFlow: OrderStatus[] = ['pending', 'processing', 'shipping', 'delivered'];

const statusConfig = {
    pending: { label: 'Chờ xác nhận', icon: FiClock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    processing: { label: 'Đang xử lý', icon: FiPackage, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    shipping: { label: 'Đang giao', icon: FiTruck, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    delivered: { label: 'Đã giao', icon: FiCheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
    cancelled: { label: 'Đã hủy', icon: FiXCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

export default function OrderTimeline({ order }: OrderTimelineProps) {
    const currentStatus = order.status as OrderStatus;
    const isCancelled = currentStatus === 'cancelled';

    // Get current status index
    const currentIndex = statusFlow.indexOf(currentStatus);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Tiến trình đơn hàng</h2>

            {isCancelled ? (
                // Cancelled order display
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className={`shrink-0 w-10 h-10 rounded-full ${statusConfig.cancelled.bgColor} flex items-center justify-center`}>
                        <FiXCircle className={`text-xl ${statusConfig.cancelled.color}`} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{statusConfig.cancelled.label}</p>
                        <p className="text-sm text-gray-600">
                            {order.updated_at ? new Date(order.updated_at).toLocaleString('vi-VN') : ''}
                        </p>
                        {order.cancel_reason && (
                            <p className="text-sm text-gray-600 mt-1">
                                Lý do: {order.cancel_reason}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                // Normal order timeline
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {statusFlow.map((status, index) => {
                        const config = statusConfig[status];
                        const Icon = config.icon;
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={status} className="relative flex items-start gap-4 mb-8 last:mb-0">
                                {/* Icon */}
                                <div className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                        ? config.bgColor
                                        : 'bg-gray-100'
                                    }`}>
                                    <Icon className={`text-xl ${isCompleted
                                            ? config.color
                                            : 'text-gray-400'
                                        }`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <p className={`font-medium ${isCompleted
                                            ? 'text-gray-900'
                                            : 'text-gray-400'
                                        }`}>
                                        {config.label}
                                    </p>
                                    {isCurrent && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.updated_at ? new Date(order.updated_at).toLocaleString('vi-VN') : ''}
                                        </p>
                                    )}
                                    {status === 'pending' && index <= currentIndex && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : ''}
                                        </p>
                                    )}
                                </div>

                                {/* Current badge */}
                                {isCurrent && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                        Hiện tại
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Estimated delivery (if shipping) */}
            {currentStatus === 'shipping' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                        <strong>Dự kiến giao hàng:</strong> 2-3 ngày làm việc
                    </p>
                </div>
            )}

            {/* Payment status */}
            <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Trạng thái thanh toán:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : order.payment_status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {order.payment_status === 'paid' ? 'Đã thanh toán' :
                            order.payment_status === 'failed' ? 'Thanh toán thất bại' :
                                order.payment_status === 'refunded' ? 'Đã hoàn tiền' :
                                    'Chưa thanh toán'}
                    </span>
                </div>
            </div>
        </div>
    );
}
