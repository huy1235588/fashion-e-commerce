'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { productService } from '@/services/product.service';
import { Product } from '@/types';

export default function AdminProductsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        loadProducts();
    }, [user, router, page]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts({ page, limit: 20 });
            setProducts(response.data);
            setTotalPages(response.total_pages);
        } catch (err) {
            console.error('Failed to load products:', err);
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

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            ← Quay lại Dashboard
                        </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-yellow-800">
                            <strong>Lưu ý:</strong> Tính năng thêm/sửa/xóa sản phẩm qua giao diện đang được phát triển.
                            Hiện tại bạn có thể quản lý sản phẩm thông qua API endpoints:
                        </p>
                        <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                            <li>POST /api/v1/admin/products - Thêm sản phẩm</li>
                            <li>PUT /api/v1/admin/products/:id - Cập nhật sản phẩm</li>
                            <li>DELETE /api/v1/admin/products/:id - Xóa sản phẩm</li>
                        </ul>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => {
                                    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {product.category?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.price.toLocaleString()}đ
                                                {product.discount_price && (
                                                    <span className="block text-xs text-red-600">
                                                        Giảm: {product.discount_price.toLocaleString()}đ
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.is_active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {product.is_active ? 'Hoạt động' : 'Không hoạt động'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={totalStock === 0 ? 'text-red-600 font-medium' :
                                                    totalStock < 10 ? 'text-yellow-600 font-medium' :
                                                        'text-gray-900'}>
                                                    {totalStock}
                                                </span>
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
