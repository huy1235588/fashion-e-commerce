'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { adminService } from '@/services/admin.service';
import { AdminUser } from '@/types/admin';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from '@/components/common/Toast';
import { FiEye, FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';

export default function AdminCustomersPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [customers, setCustomers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleDialog, setRoleDialog] = useState<{
        isOpen: boolean;
        userId: number | null;
        currentRole: string;
        newRole: 'user' | 'admin' | null;
    }>({
        isOpen: false,
        userId: null,
        currentRole: '',
        newRole: null,
    });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        loadCustomers();
    }, [user, router, page]);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await adminService.getAllUsers(page, 20);
            setCustomers(response.data);
            setTotalPages(response.pagination?.total_pages || 1);
        } catch (err: any) {
            setError('Không thể tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async () => {
        if (!roleDialog.userId || !roleDialog.newRole) return;

        try {
            await adminService.updateUserRole(roleDialog.userId, { role: roleDialog.newRole });
            toast.success('Đã cập nhật vai trò người dùng');
            loadCustomers();
        } catch (err: any) {
            toast.error('Không thể cập nhật vai trò');
        } finally {
            setRoleDialog({ isOpen: false, userId: null, currentRole: '', newRole: null });
        }
    };

    const confirmRoleChange = (userId: number, currentRole: string, newRole: 'user' | 'admin') => {
        setRoleDialog({ isOpen: true, userId, currentRole, newRole });
    };

    const filteredCustomers = customers.filter(customer => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            customer.email.toLowerCase().includes(query) ||
            customer.first_name.toLowerCase().includes(query) ||
            customer.last_name.toLowerCase().includes(query)
        );
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    if (loading && customers.length === 0) {
        return <Loading />;
    }

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Khách Hàng</h1>
                            <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng trong hệ thống</p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            ← Dashboard
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="flex-1 relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm kiếm theo email, tên khách hàng..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </form>
                    </div>

                    <ErrorMessage message={error} className="mb-6" />

                    {/* Customers Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Khách hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày đăng ký
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCustomers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                Không tìm thấy khách hàng nào
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCustomers.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    #{customer.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.first_name} {customer.last_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {customer.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        customer.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {customer.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(customer.created_at).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => router.push(`/admin/customers/${customer.id}`)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FiEye className="w-4 h-4" />
                                                        </button>
                                                        {customer.id !== user?.id && (
                                                            <button
                                                                onClick={() => confirmRoleChange(
                                                                    customer.id,
                                                                    customer.role,
                                                                    customer.role === 'admin' ? 'user' : 'admin'
                                                                )}
                                                                className={`p-2 rounded-md ${
                                                                    customer.role === 'admin'
                                                                        ? 'text-orange-600 hover:bg-orange-50'
                                                                        : 'text-green-600 hover:bg-green-50'
                                                                }`}
                                                                title={customer.role === 'admin' ? 'Gỡ quyền admin' : 'Đặt làm admin'}
                                                            >
                                                                {customer.role === 'admin' ? (
                                                                    <FiUserX className="w-4 h-4" />
                                                                ) : (
                                                                    <FiUserCheck className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-600">Tổng khách hàng</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">
                                {customers.length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-600">Quản trị viên</div>
                            <div className="text-2xl font-bold text-purple-600 mt-1">
                                {customers.filter(c => c.role === 'admin').length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-600">Người dùng thường</div>
                            <div className="text-2xl font-bold text-blue-600 mt-1">
                                {customers.filter(c => c.role === 'user').length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={roleDialog.isOpen}
                title="Xác nhận thay đổi vai trò"
                message={`Bạn có chắc chắn muốn ${
                    roleDialog.newRole === 'admin' ? 'đặt người dùng này làm quản trị viên' : 'gỡ quyền quản trị viên của người dùng này'
                }?`}
                confirmText="Xác nhận"
                cancelText="Hủy"
                variant={roleDialog.newRole === 'admin' ? 'info' : 'danger'}
                onConfirm={handleUpdateRole}
                onCancel={() => setRoleDialog({ isOpen: false, userId: null, currentRole: '', newRole: null })}
            />
        </PrivateRoute>
    );
}
