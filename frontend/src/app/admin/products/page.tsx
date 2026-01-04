'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { productService } from '@/services/product.service';
import { Product } from '@/types';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from '@/components/common/Toast';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiSearch } from 'react-icons/fi';

export default function AdminProductsPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productId: number | null }>({
        isOpen: false,
        productId: null,
    });

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        loadProducts();
    }, [user, router, page, searchQuery]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await productService.getProducts({ 
                page, 
                limit: 20,
                search: searchQuery || undefined,
            });
            setProducts(response.data);
            setTotalPages(response.total_pages);
        } catch (err: any) {
            setError('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.productId) return;

        try {
            await productService.deleteProduct(deleteDialog.productId);
            toast.success('Đã xóa sản phẩm');
            loadProducts();
        } catch (err: any) {
            toast.error('Không thể xóa sản phẩm');
        } finally {
            setDeleteDialog({ isOpen: false, productId: null });
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    if (loading && products.length === 0) {
        return <Loading />;
    }

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
                            <p className="text-gray-600 mt-1">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                ← Dashboard
                            </button>
                            <button
                                onClick={() => router.push('/admin/products/add')}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <FiPlus className="w-5 h-5" />
                                Thêm sản phẩm
                            </button>
                        </div>
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
                                    placeholder="Tìm kiếm sản phẩm theo tên..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Tìm kiếm
                            </button>
                        </form>
                    </div>

                    <ErrorMessage message={error} className="mb-6" />

                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Sản phẩm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Danh mục
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Giá
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tồn kho
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                Không tìm thấy sản phẩm nào
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product) => {
                                            const totalStock = product.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
                                            const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;
                                            
                                            return (
                                                <tr key={product.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        #{product.id}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                                {primaryImage ? (
                                                                    <img
                                                                        src={primaryImage}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <FiEye className="w-6 h-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="max-w-xs">
                                                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                                    {product.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {product.category?.name || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm">
                                                            {product.discount_price ? (
                                                                <>
                                                                    <div className="font-semibold text-blue-600">
                                                                        {product.discount_price.toLocaleString('vi-VN')}₫
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 line-through">
                                                                        {product.price.toLocaleString('vi-VN')}₫
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="font-semibold text-gray-900">
                                                                    {product.price.toLocaleString('vi-VN')}₫
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            totalStock === 0
                                                                ? 'bg-red-100 text-red-800'
                                                                : totalStock < 10
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {totalStock} sản phẩm
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            product.is_active
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {product.is_active ? 'Đang bán' : 'Tạm ẩn'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => router.push(`/products/${product.id}`)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                                                                title="Xem chi tiết"
                                                            >
                                                                <FiEye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                                                                title="Chỉnh sửa"
                                                            >
                                                                <FiEdit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteDialog({ isOpen: true, productId: product.id })}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                                                title="Xóa"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
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
                            <div className="text-sm text-gray-600">Tổng sản phẩm</div>
                            <div className="text-2xl font-bold text-gray-900 mt-1">
                                {products.length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-600">Đang bán</div>
                            <div className="text-2xl font-bold text-green-600 mt-1">
                                {products.filter(p => p.is_active).length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-sm text-gray-600">Hết hàng</div>
                            <div className="text-2xl font-bold text-red-600 mt-1">
                                {products.filter(p => {
                                    const stock = p.variants?.reduce((sum, v) => sum + v.stock_quantity, 0) || 0;
                                    return stock === 0;
                                }).length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                title="Xác nhận xóa sản phẩm"
                message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteDialog({ isOpen: false, productId: null })}
            />
        </PrivateRoute>
    );
}
