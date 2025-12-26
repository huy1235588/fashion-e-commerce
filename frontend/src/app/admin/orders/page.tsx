'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { adminService } from '@/services/admin.service';
import { Order } from '@/types/order';
import { FiClock, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const statusConfig = {
    pending: { label: 'Chờ xác nhận', icon: FiClock, color: 'text-yellow-600 bg-yellow-50' },
    processing: { label: 'Đang xử lý', icon: FiPackage, color: 'text-blue-600 bg-blue-50' },
    shipping: { label: 'Đang giao', icon: FiTruck, color: 'text-purple-600 bg-purple-50' },
    delivered: { label: 'Đã giao', icon: FiCheckCircle, color: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Đã hủy', icon: FiXCircle, color: 'text-red-600 bg-red-50' },
};

export default function AdminOrdersPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        loadOrders();
    }, [user, router, page, statusFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllOrders(page, 20, statusFilter || undefined);
            setOrders(response.data);
            setTotalPages(response.pagination.total_pages);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, status: string) => {
        try {
            await adminService.updateOrderStatus(orderId, { status: status as any });
            loadOrders();
            alert('Cập nhật trạng thái thành công');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Không thể cập nhật trạng thái');
        }
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
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            ← Quay lại Dashboard
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lọc theo trạng thái</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            <option value="pending">Chờ xác nhận</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipping">Đang giao</option>
                            <option value="delivered">Đã giao</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã ĐH</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => {
                                    const config = statusConfig[order.status as keyof typeof statusConfig];
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{order.order_code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {order.shipping_full_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.total_amount.toLocaleString()}đ
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="pending">Chờ xác nhận</option>
                                                    <option value="processing">Đang xử lý</option>
                                                    <option value="shipping">Đang giao</option>
                                                    <option value="delivered">Đã giao</option>
                                                    <option value="cancelled">Đã hủy</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Trước
                            </button>
                            <span className="px-4 py-2">
                                Trang {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </PrivateRoute>
    );
}
