'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiPackage } from 'react-icons/fi';
import ProductCard from '@/components/product/ProductCard';
import ProductListView from '@/components/product/ProductListView';
import FilterSidebar from '@/components/product/FilterSidebar';
import SortDropdown, { SortOption } from '@/components/product/SortDropdown';
import ViewToggle from '@/components/product/ViewToggle';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import { Button } from '@/components/ui';
import { productService } from '@/services/product.service';
import type { Product, Category } from '@/types';

const sortOptions: SortOption[] = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Giá: Thấp đến cao', value: 'price_asc' },
    { label: 'Giá: Cao đến thấp', value: 'price_desc' },
    { label: 'Bán chạy nhất', value: 'bestseller' },
    { label: 'Đánh giá cao', value: 'rating' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    
    // View state
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('newest');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    
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
                setTotalProducts(response.total);
            } catch (err: any) {
                setError('Không thể tải sản phẩm');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, selectedCategory, searchQuery, minPrice, maxPrice]);

    const handleCategoryChange = (categoryId: number | undefined) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePriceChange = (min?: number, max?: number) => {
        setMinPrice(min);
        setMaxPrice(max);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSelectedCategory(undefined);
        setSearchQuery('');
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setCurrentPage(1);
    };

    const selectedCategoryName = selectedCategory 
        ? categories.find(c => c.id === selectedCategory)?.name 
        : undefined;

    const breadcrumbItems = [
        { label: 'Sản phẩm', href: '/products' },
        ...(selectedCategoryName ? [{ label: selectedCategoryName }] : []),
    ];

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-6">
                    <Breadcrumbs items={breadcrumbItems} className="mb-4" />
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {selectedCategoryName || 'Tất cả sản phẩm'}
                            </h1>
                            {!isLoading && (
                                <p className="text-gray-600 mt-1">
                                    Hiển thị {products.length} trong số {totalProducts} sản phẩm
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Mobile Filter Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setMobileFilterOpen(true)}
                                className="lg:hidden gap-2"
                            >
                                <FiFilter className="w-4 h-4" />
                                Bộ lọc
                            </Button>

                            <SortDropdown
                                options={sortOptions}
                                value={sortBy}
                                onChange={setSortBy}
                            />

                            <ViewToggle
                                view={viewMode}
                                onChange={setViewMode}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Filter Sidebar - Responsive for both mobile and desktop */}
                    <FilterSidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onPriceChange={handlePriceChange}
                        onClearFilters={handleClearFilters}
                        isMobileOpen={mobileFilterOpen}
                        onMobileClose={() => setMobileFilterOpen(false)}
                    />

                    {/* Products */}
                    <div className="min-w-0">
                        {isLoading ? (
                            <Loading />
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FiPackage className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                                </p>
                                <Button onClick={handleClearFilters}>
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        ) : (
                            <>
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                        {products.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <ProductCard product={product} />
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {products.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <ProductListView product={product} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-10 flex justify-center">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </Button>
                                            
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum: number;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (currentPage >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i;
                                                    } else {
                                                        pageNum = currentPage - 2 + i;
                                                    }

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setCurrentPage(pageNum)}
                                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                                                currentPage === pageNum
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
