'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { adminService } from '@/services/admin.service';
import { DashboardStats } from '@/types/admin';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        loadStats();
    }, [user, router]);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) return null;

    const revenueGrowth = stats.revenue_last_month > 0
        ? ((stats.revenue_this_month - stats.revenue_last_month) / stats.revenue_last_month * 100).toFixed(1)
        : '0';

    const ordersGrowth = stats.orders_last_month > 0
        ? ((stats.orders_this_month - stats.orders_last_month) / stats.orders_last_month * 100).toFixed(1)
        : '0';

    const usersGrowth = stats.new_users_last_month > 0
        ? ((stats.new_users_this_month - stats.new_users_last_month) / stats.new_users_last_month * 100).toFixed(1)
        : '0';

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Quản Trị</h1>

                    {/* Main Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Tổng Doanh Thu</h3>
                                <FiDollarSign className="text-green-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_revenue.toLocaleString()}đ</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Tháng này: {stats.revenue_this_month.toLocaleString()}đ
                            </p>
                            <div className={`text-xs mt-1 ${parseFloat(revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parseFloat(revenueGrowth) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(revenueGrowth))}% so với tháng trước
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Tổng Đơn Hàng</h3>
                                <FiShoppingCart className="text-blue-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_orders.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Tháng này: {stats.orders_this_month}
                            </p>
                            <div className={`text-xs mt-1 ${parseFloat(ordersGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parseFloat(ordersGrowth) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(ordersGrowth))}% so với tháng trước
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Người Dùng</h3>
                                <FiUsers className="text-purple-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_users.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Mới tháng này: {stats.new_users_this_month}
                            </p>
                            <div className={`text-xs mt-1 ${parseFloat(usersGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {parseFloat(usersGrowth) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(usersGrowth))}% so với tháng trước
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Sản Phẩm</h3>
                                <FiPackage className="text-orange-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_products.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Tồn kho thấp: {stats.low_stock_products}
                            </p>
                            <p className="text-sm text-red-600 mt-1">
                                Hết hàng: {stats.out_of_stock_products}
                            </p>
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng Thái Đơn Hàng</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Chờ xác nhận</span>
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {stats.pending_orders}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Đang xử lý</span>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {stats.processing_orders}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Đang giao</span>
                                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {stats.shipping_orders}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Đã giao</span>
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {stats.delivered_orders}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Đã hủy</span>
                                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {stats.cancelled_orders}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cảnh Báo Tồn Kho</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                    <FiAlertTriangle className="text-yellow-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Sản phẩm tồn kho thấp</p>
                                        <p className="text-sm text-gray-600">{stats.low_stock_products} sản phẩm có số lượng dưới 10</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                                    <FiAlertTriangle className="text-red-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Sản phẩm hết hàng</p>
                                        <p className="text-sm text-gray-600">{stats.out_of_stock_products} sản phẩm đã hết hàng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quản Lý Nhanh</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => router.push('/admin/orders')}
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                            >
                                <FiShoppingCart className="text-2xl text-blue-600 mb-2" />
                                <h3 className="font-medium text-gray-900">Quản Lý Đơn Hàng</h3>
                                <p className="text-sm text-gray-500">Xem và cập nhật đơn hàng</p>
                            </button>

                            <button
                                onClick={() => router.push('/admin/products')}
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                            >
                                <FiPackage className="text-2xl text-orange-600 mb-2" />
                                <h3 className="font-medium text-gray-900">Quản Lý Sản Phẩm</h3>
                                <p className="text-sm text-gray-500">Thêm và chỉnh sửa sản phẩm</p>
                            </button>

                            <button
                                onClick={() => router.push('/admin/users')}
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                            >
                                <FiUsers className="text-2xl text-purple-600 mb-2" />
                                <h3 className="font-medium text-gray-900">Quản Lý Người Dùng</h3>
                                <p className="text-sm text-gray-500">Xem danh sách người dùng</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
