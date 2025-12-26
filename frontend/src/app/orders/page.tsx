'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/order.service';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const statusConfig = {
    pending: { label: 'Chờ xác nhận', icon: FiClock, color: 'text-yellow-600 bg-yellow-50' },
    processing: { label: 'Đang xử lý', icon: FiPackage, color: 'text-blue-600 bg-blue-50' },
    shipping: { label: 'Đang giao', icon: FiTruck, color: 'text-purple-600 bg-purple-50' },
    delivered: { label: 'Đã giao', icon: FiCheckCircle, color: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Đã hủy', icon: FiXCircle, color: 'text-red-600 bg-red-50' },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const { orders: data } = await orderService.getMyOrders();
            setOrders(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: OrderStatus) => {
        return statusConfig[status] || statusConfig.pending;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <PrivateRoute>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <FiPackage className="mx-auto text-gray-400 mb-4" size={64} />
                        <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
                        <Link
                            href="/products"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const config = getStatusConfig(order.status);
                            const StatusIcon = config.icon;

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-gray-900">
                                                Mã đơn: {order.order_code}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <OrderStatusBadge status={order.status as OrderStatus} />
                                    </div>

                                    <div className="p-4">
                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <OrderStatusBadge status={order.status as OrderStatus} showProgress={true} />
                                        </div>

                                        {order.order_items?.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex gap-4 mb-3 last:mb-0">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.product_name}</p>
                                                    {item.variant_name && (
                                                        <p className="text-sm text-gray-600">Size: {item.variant_name}</p>
                                                    )}
                                                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">
                                                        {item.subtotal.toLocaleString()}đ
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {order.order_items && order.order_items.length > 3 && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                và {order.order_items.length - 3} sản phẩm khác...
                                            </p>
                                        )}
                                    </div>

                                    <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Tổng tiền:</p>
                                            <p className="text-lg font-bold text-blue-600">
                                                {order.total_amount.toLocaleString()}đ
                                            </p>
                                        </div>
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </PrivateRoute>
    );
}
