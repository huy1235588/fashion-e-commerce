'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import PrivateRoute from '@/components/auth/PrivateRoute';
import Loading from '@/components/common/Loading';

export default function ProfilePage() {
    return (
        <PrivateRoute>
            <ProfileContent />
        </PrivateRoute>
    );
}

function ProfileContent() {
    const { user, setUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const updatedUser = await authService.updateProfile(formData);
            setUser(updatedUser);
            setSuccess('Cập nhật thông tin thành công');
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Cập nhật thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={user.email}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vai trò
                            </label>
                            <input
                                type="text"
                                value={user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                            >
                                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        full_name: user.full_name || '',
                                        phone: user.phone || '',
                                    });
                                }}
                                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-400 font-semibold"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900">{user.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <p className="text-gray-900">{user.full_name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <p className="text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                            <p className="text-gray-900">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <p className="text-gray-900">
                                {user.is_active ? (
                                    <span className="text-green-600 font-semibold">Đang hoạt động</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Bị khóa</span>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
