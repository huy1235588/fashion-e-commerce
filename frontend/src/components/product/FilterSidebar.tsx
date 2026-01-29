'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button, Input } from '@/components/ui';
import type { Category } from '@/types';

interface FilterSidebarProps {
    categories: Category[];
    selectedCategory?: number;
    onCategoryChange: (categoryId: number | undefined) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    minPrice?: number;
    maxPrice?: number;
    onPriceChange: (min?: number, max?: number) => void;
    onClearFilters: () => void;
    className?: string;
    // Mobile props
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 text-left"
            >
                <span className="font-semibold text-gray-900">{title}</span>
                {isOpen ? (
                    <FiChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const priceRanges = [
    { label: 'Dưới 100.000₫', min: 0, max: 100000 },
    { label: '100.000₫ - 500.000₫', min: 100000, max: 500000 },
    { label: '500.000₫ - 1.000.000₫', min: 500000, max: 1000000 },
    { label: 'Trên 1.000.000₫', min: 1000000, max: undefined },
];

export default function FilterSidebar({
    categories,
    selectedCategory,
    onCategoryChange,
    searchQuery,
    onSearchChange,
    minPrice,
    maxPrice,
    onPriceChange,
    onClearFilters,
    className,
    isMobileOpen,
    onMobileClose,
}: FilterSidebarProps) {
    const hasActiveFilters = selectedCategory || searchQuery || minPrice !== undefined || maxPrice !== undefined;

    const filterContent = (
        <div className={cn('space-y-2', className)}>
            {/* Mobile Header */}
            {isMobileOpen !== undefined && (
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 lg:hidden">
                    <h2 className="text-lg font-bold text-gray-900">Bộ lọc</h2>
                    <button
                        onClick={onMobileClose}
                        className="p-2 text-gray-400 hover:text-gray-600"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                >
                    <FiX className="w-4 h-4" />
                    Xóa tất cả bộ lọc
                </button>
            )}

            {/* Search */}
            <FilterSection title="Tìm kiếm" defaultOpen>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Tìm sản phẩm..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                </div>
            </FilterSection>

            {/* Categories */}
            <FilterSection title="Danh mục" defaultOpen>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                    <button
                        onClick={() => onCategoryChange(undefined)}
                        className={cn(
                            'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                            !selectedCategory
                                ? 'bg-primary-50 text-primary-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                        )}
                    >
                        <span>Tất cả sản phẩm</span>
                        {!selectedCategory && (
                            <div className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={cn(
                                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                                selectedCategory === cat.id
                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                            )}
                        >
                            <span>{cat.name}</span>
                            {selectedCategory === cat.id && (
                                <div className="w-2 h-2 rounded-full bg-primary-500" />
                            )}
                        </button>
                    ))}
                </div>
            </FilterSection>

            {/* Price Range */}
            <FilterSection title="Khoảng giá" defaultOpen>
                <div className="space-y-2 mb-4">
                    {priceRanges.map((range, index) => {
                        const isSelected = minPrice === range.min && maxPrice === range.max;
                        return (
                            <button
                                key={index}
                                onClick={() => onPriceChange(range.min, range.max)}
                                className={cn(
                                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                                    isSelected
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                )}
                            >
                                <span>{range.label}</span>
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Custom Price Range */}
                <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Hoặc nhập khoảng giá</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Từ"
                            value={minPrice || ''}
                            onChange={(e) => onPriceChange(
                                e.target.value ? Number(e.target.value) : undefined,
                                maxPrice
                            )}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm w-full"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            placeholder="Đến"
                            value={maxPrice || ''}
                            onChange={(e) => onPriceChange(
                                minPrice,
                                e.target.value ? Number(e.target.value) : undefined
                            )}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm w-full"
                        />
                    </div>
                </div>
            </FilterSection>

            {/* Mobile Apply Button */}
            {isMobileOpen !== undefined && (
                <div className="pt-4 lg:hidden">
                    <Button onClick={onMobileClose} className="w-full">
                        Áp dụng bộ lọc
                    </Button>
                </div>
            )}
        </div>
    );

    // Mobile: Render as slide-in drawer
    if (isMobileOpen !== undefined) {
        return (
            <>
                {/* Backdrop */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onMobileClose}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Drawer */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 p-6 overflow-y-auto lg:hidden"
                        >
                            {filterContent}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Desktop: Normal sidebar */}
                <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Bộ lọc</h2>
                    {filterContent}
                </div>
            </>
        );
    }

    // Desktop only
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Bộ lọc</h2>
            {filterContent}
        </div>
    );
}
