'use client';

import { useState, useEffect } from 'react';
import ProductList from '@/components/product/ProductList';
import Loading from '@/components/common/Loading';
import { productService } from '@/services/product.service';
import type { Product, Category } from '@/types';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Filters
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await productService.getCategories();
                setCategories(cats);
            } catch (err) {
                console.error('Failed to load categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await productService.getProducts({
                    page: currentPage,
                    limit: 12,
                    category_id: selectedCategory,
                    search: searchQuery || undefined,
                    min_price: minPrice,
                    max_price: maxPrice,
                });
                setProducts(response.data);
                setTotalPages(response.total_pages);
            } catch (err: any) {
                setError('Không thể tải sản phẩm');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory, searchQuery, minPrice, maxPrice]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleCategoryChange = (categoryId: number | undefined) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Sản phẩm</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Bộ lọc</h2>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm sản phẩm..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </form>

                        {/* Categories */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục
                            </label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleCategoryChange(undefined)}
                                    className={`w-full text-left px-3 py-2 rounded ${
                                        !selectedCategory
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    Tất cả
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`w-full text-left px-3 py-2 rounded ${
                                            selectedCategory === cat.id
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Khoảng giá
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="number"
                                    placeholder="Giá tối thiểu"
                                    value={minPrice || ''}
                                    onChange={(e) => {
                                        setMinPrice(e.target.value ? Number(e.target.value) : undefined);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="number"
                                    placeholder="Giá tối đa"
                                    value={maxPrice || ''}
                                    onChange={(e) => {
                                        setMaxPrice(e.target.value ? Number(e.target.value) : undefined);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <>
                            <ProductList products={products} />

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                    >
                                        Trước
                                    </button>
                                    <span className="px-4 py-2">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
