'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import ProductForm from '@/components/product/ProductForm';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import { productService } from '@/services/product.service';
import { Product } from '@/types';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const productId = params?.id ? parseInt(params.id as string) : null;

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        if (productId) {
            loadProduct();
        } else {
            setError('ID sản phẩm không hợp lệ');
            setLoading(false);
        }
    }, [user, router, productId]);

    const loadProduct = async () => {
        if (!productId) return;

        try {
            setLoading(true);
            setError('');
            const data = await productService.getProductById(productId);
            setProduct(data);
        } catch (err: any) {
            setError('Không thể tải thông tin sản phẩm');
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

    if (error || !product) {
        return (
            <PrivateRoute>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4 py-8">
                        <ErrorMessage message={error || 'Không tìm thấy sản phẩm'} />
                        <button
                            onClick={() => router.back()}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            ← Quay lại
                        </button>
                    </div>
                </div>
            </PrivateRoute>
        );
    }

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Chỉnh Sửa Sản Phẩm</h1>
                        <p className="text-gray-600 mt-1">Cập nhật thông tin sản phẩm #{product.id}</p>
                    </div>

                    <ProductForm mode="edit" product={product} />
                </div>
            </div>
        </PrivateRoute>
    );
}
