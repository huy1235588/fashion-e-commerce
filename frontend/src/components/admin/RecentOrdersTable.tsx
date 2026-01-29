'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiTruck, FiPackage, FiXCircle } from 'react-icons/fi';
import { formatCurrency, cn } from '@/lib/utils';
import { Badge } from '@/components/ui';

interface Order {
    id: number;
    order_code: string;
    customer_name: string;
    customer_email: string;
    total: number;
    status: string;
    created_at: string;
}

interface RecentOrdersTableProps {
    orders: Order[];
}

const statusConfig: Record<string, { label: string; icon: typeof FiClock; variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent' }> = {
    pending: { label: 'Chờ xử lý', icon: FiClock, variant: 'warning' },
    confirmed: { label: 'Đã xác nhận', icon: FiCheckCircle, variant: 'info' },
    shipping: { label: 'Đang giao', icon: FiTruck, variant: 'accent' },
    delivered: { label: 'Đã giao', icon: FiPackage, variant: 'success' },
    cancelled: { label: 'Đã hủy', icon: FiXCircle, variant: 'error' },
};

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Đơn Hàng Gần Đây</h3>
                        <p className="text-sm text-gray-500">Đơn hàng mới nhất cần xử lý</p>
                    </div>
                    <Link
                        href="/admin/orders"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Xem tất cả →
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã đơn
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Khách hàng
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tổng tiền
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thời gian
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Chưa có đơn hàng nào
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => {
                                const status = statusConfig[order.status] || statusConfig.pending;
                                const StatusIcon = status.icon;

                                return (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-medium text-primary-600 hover:text-primary-700"
                                            >
                                                #{order.order_code}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.customer_name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {order.customer_email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={status.variant} className="gap-1">
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                    </motion.tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
