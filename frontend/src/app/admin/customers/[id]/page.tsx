'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { adminService } from '@/services/admin.service';
import { orderService } from '@/services/order.service';
import { AdminUser } from '@/types/admin';
import { Order, OrderStatus } from '@/types';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiPackage } from 'react-icons/fi';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function AdminCustomerDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const [customer, setCustomer] = useState<AdminUser | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const customerId = params?.id ? parseInt(params.id as string) : null;

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        if (customerId) {
            loadCustomerData();
        } else {
            setError('ID khách hàng không hợp lệ');
            setLoading(false);
        }
    }, [user, router, customerId]);

    const loadCustomerData = async () => {
        if (!customerId) return;

        try {
            setLoading(true);
            setError('');
            
            // Load customer info and orders in parallel
            const [usersResponse, ordersResponse] = await Promise.all([
                adminService.getAllUsers(1, 1000), // Load all users to find specific one
                orderService.getAllOrders({ limit: 100 }), // Load orders
            ]);

            const customerData = usersResponse.data.find(u => u.id === customerId);
            if (!customerData) {
                setError('Không tìm thấy khách hàng');
                return;
            }

            setCustomer(customerData);
            
            // Filter orders for this customer
            const customerOrders = ordersResponse.orders.filter(o => o.user_id === customerId);
            setOrders(customerOrders);
        } catch (err: any) {
            setError('Không thể tải thông tin khách hàng');
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    if (loading) {
        return <Loading />;
    }

    if (error || !customer) {
        return (
            <PrivateRoute>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4 py-8">
                        <ErrorMessage message={error || 'Không tìm thấy khách hàng'} />
                        <button
                            onClick={() => router.push('/admin/customers')}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            ← Quay lại danh sách
                        </button>
                    </div>
                </div>
            </PrivateRoute>
        );
    }

    const totalSpent = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.total_amount, 0);

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.push('/admin/customers')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Quay lại danh sách
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Chi Tiết Khách Hàng</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FiUser className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {customer.first_name} {customer.last_name}
                                        </h2>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            customer.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {customer.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FiMail className="w-4 h-4" />
                                        <span className="text-sm">{customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FiCalendar className="w-4 h-4" />
                                        <span className="text-sm">
                                            Tham gia: {new Date(customer.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-600">Tổng đơn hàng</div>
                                        <div className="text-2xl font-bold text-gray-900 mt-1">
                                            {orders.length}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Đã hoàn thành</div>
                                        <div className="text-2xl font-bold text-green-600 mt-1">
                                            {orders.filter(o => o.status === 'delivered').length}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">Tổng chi tiêu</div>
                                        <div className="text-2xl font-bold text-blue-600 mt-1">
                                            {totalSpent.toLocaleString('vi-VN')}₫
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FiPackage className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Lịch sử đơn hàng</h2>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        Khách hàng chưa có đơn hàng nào
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <div className="text-sm font-medium text-blue-600">
                                                            {order.order_code}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {order.total_amount.toLocaleString('vi-VN')}₫
                                                        </div>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                                            ORDER_STATUS_COLORS[order.status]
                                                        }`}>
                                                            {ORDER_STATUS_LABELS[order.status]}
                                                        </span>
                                                    </div>
                                                </div>

                                                {order.order_items && order.order_items.length > 0 && (
                                                    <div className="text-xs text-gray-600 mt-2">
                                                        {order.order_items.length} sản phẩm
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
