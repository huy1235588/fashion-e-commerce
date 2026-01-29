'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { statisticsService, DashboardStats } from '@/services/statistics.service';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import { FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiAlertTriangle, FiCalendar } from 'react-icons/fi';
import { StatsCard, RevenueChart, RecentOrdersTable, QuickActions } from '@/components/admin';

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

    // Mock data for chart (replace with real API data)
    const revenueChartData = [
        { date: 'T2', revenue: 1200000, orders: 5 },
        { date: 'T3', revenue: 2100000, orders: 8 },
        { date: 'T4', revenue: 1800000, orders: 6 },
        { date: 'T5', revenue: 2500000, orders: 10 },
        { date: 'T6', revenue: 3200000, orders: 12 },
        { date: 'T7', revenue: 4100000, orders: 15 },
        { date: 'CN', revenue: 2800000, orders: 9 },
    ];

    // Mock recent orders (replace with real API data)
    const recentOrders = [
        {
            id: 1,
            order_code: 'DH001234',
            customer_name: 'Nguyễn Văn A',
            customer_email: 'nguyenvana@email.com',
            total: 1250000,
            status: 'pending',
            created_at: new Date().toISOString(),
        },
        {
            id: 2,
            order_code: 'DH001235',
            customer_name: 'Trần Thị B',
            customer_email: 'tranthib@email.com',
            total: 890000,
            status: 'confirmed',
            created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
            id: 3,
            order_code: 'DH001236',
            customer_name: 'Lê Văn C',
            customer_email: 'levanc@email.com',
            total: 2150000,
            status: 'shipping',
            created_at: new Date(Date.now() - 7200000).toISOString(),
        },
    ];

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Dashboard Quản Trị
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            {new Date().toLocaleDateString('vi-VN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <StatsCard
                            title="Tổng Doanh Thu"
                            value={stats.total_revenue}
                            subtitle={`Hôm nay: ${stats.revenue_today.toLocaleString()}₫`}
                            icon={FiDollarSign}
                            iconColor="text-emerald-600"
                            iconBgColor="bg-emerald-100"
                            trend={{ value: 12.5, type: 'up' }}
                            formatAsCurrency
                            delay={0}
                        />
                        <StatsCard
                            title="Tổng Đơn Hàng"
                            value={stats.total_orders}
                            subtitle={`Hôm nay: ${stats.orders_today} đơn`}
                            icon={FiShoppingCart}
                            iconColor="text-blue-600"
                            iconBgColor="bg-blue-100"
                            trend={{ value: 8.2, type: 'up' }}
                            delay={0.1}
                        />
                        <StatsCard
                            title="Khách Hàng"
                            value={stats.total_users}
                            icon={FiUsers}
                            iconColor="text-purple-600"
                            iconBgColor="bg-purple-100"
                            trend={{ value: 3.1, type: 'up' }}
                            delay={0.2}
                        />
                        <StatsCard
                            title="Sản Phẩm"
                            value={stats.total_products}
                            icon={FiPackage}
                            iconColor="text-orange-600"
                            iconBgColor="bg-orange-100"
                            delay={0.3}
                        />
                    </div>

                    {/* Pending Orders Alert */}
                    {stats.pending_orders > 0 && (
                        <div className="bg-warning-50 border border-warning-200 rounded-2xl p-4 mb-8 flex items-center gap-4">
                            <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center shrink-0">
                                <FiAlertTriangle className="w-6 h-6 text-warning-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-warning-800">
                                    Có {stats.pending_orders} đơn hàng đang chờ xử lý
                                </p>
                                <p className="text-sm text-warning-600">
                                    Vui lòng kiểm tra và xác nhận đơn hàng sớm nhất có thể
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/admin/orders?status=pending')}
                                className="px-4 py-2 bg-warning-600 text-white rounded-xl font-medium hover:bg-warning-700 transition-colors shrink-0"
                            >
                                Xem ngay
                            </button>
                        </div>
                    )}

                    {/* Charts & Table */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2">
                            <RevenueChart data={revenueChartData} />
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Tình Trạng Đơn Hàng
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Chờ xử lý</span>
                                    <span className="font-semibold text-warning-600">
                                        {stats.pending_orders}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-warning-500 h-2 rounded-full"
                                        style={{
                                            width: `${(stats.pending_orders / stats.total_orders) * 100}%`,
                                        }}
                                    />
                                </div>
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500">
                                        Tỷ lệ đơn hoàn thành
                                    </p>
                                    <p className="text-2xl font-bold text-success-600">
                                        {(
                                            ((stats.total_orders - stats.pending_orders) /
                                                stats.total_orders) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="mb-8">
                        <RecentOrdersTable orders={recentOrders} />
                    </div>

                    {/* Quick Actions */}
                    <QuickActions />
                </div>
            </div>
        </PrivateRoute>
    );
}
