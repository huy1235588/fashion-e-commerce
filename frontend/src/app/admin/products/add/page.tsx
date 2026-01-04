'use client';

import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import ProductForm from '@/components/product/ProductForm';
import { useEffect } from 'react';

export default function AddProductPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
        }
    }, [user, router]);

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
                        <p className="text-gray-600 mt-1">Nhập thông tin sản phẩm mới vào hệ thống</p>
                    </div>

                    <ProductForm mode="create" />
                </div>
            </div>
        </PrivateRoute>
    );
}
