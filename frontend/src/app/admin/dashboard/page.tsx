'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { statisticsService, DashboardStats } from '@/services/statistics.service';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('');
            const data = await statisticsService.getDashboardStats();
            setStats(data);
        } catch (err: any) {
            console.error('Failed to load stats:', err);
            setError('Không thể tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (!stats) return null;

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
                            <p className="text-2xl font-bold text-gray-900">{stats.total_revenue.toLocaleString()}₫</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Hôm nay: {stats.revenue_today.toLocaleString()}₫
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Tổng Đơn Hàng</h3>
                                <FiShoppingCart className="text-blue-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_orders.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Hôm nay: {stats.orders_today}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Khách Hàng</h3>
                                <FiUsers className="text-purple-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_users.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Sản Phẩm</h3>
                                <FiPackage className="text-orange-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_products.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Đơn Chờ Xử Lý</h3>
                                <FiAlertTriangle className="text-yellow-600 text-xl" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending_orders.toLocaleString()}</p>
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
