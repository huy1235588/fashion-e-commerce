'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    FiX, 
    FiSearch, 
    FiUser, 
    FiShoppingCart, 
    FiPackage, 
    FiMapPin,
    FiLogOut,
    FiChevronRight,
    FiChevronDown,
    FiHome,
    FiGrid,
    FiShield
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { Category } from '@/types';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export default function MobileDrawer({ isOpen, onClose, categories }: MobileDrawerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuth();
    const { totalItems } = useCart();

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        onClose();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/50 z-modal-backdrop transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={cn(
                    'fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-modal shadow-2xl transition-transform duration-300 ease-out',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <Link href="/" onClick={onClose} className="text-xl font-bold text-gray-900">
                        Fashion Store
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100">
                    <form onSubmit={handleSearch}>
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                            <FiSearch className="ml-3 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm kiếm..."
                                className="flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none"
                            />
                        </div>
                    </form>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto">
                    <nav className="p-2">
                        {/* Home */}
                        <Link
                            href="/"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <FiHome className="h-5 w-5 text-gray-400" />
                            Trang chủ
                        </Link>

                        {/* Products */}
                        <Link
                            href="/products"
                            onClick={onClose}
                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <FiGrid className="h-5 w-5 text-gray-400" />
                            Sản phẩm
                        </Link>

                        {/* Categories accordion */}
                        <div>
                            <button
                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FiGrid className="h-5 w-5 text-gray-400" />
                                    Danh mục
                                </div>
                                <FiChevronDown
                                    className={cn(
                                        'h-5 w-5 text-gray-400 transition-transform duration-200',
                                        isCategoriesOpen && 'rotate-180'
                                    )}
                                />
                            </button>
                            <div
                                className={cn(
                                    'overflow-hidden transition-all duration-200',
                                    isCategoriesOpen ? 'max-h-96' : 'max-h-0'
                                )}
                            >
                                <div className="pl-8 py-1 space-y-1">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/products?category=${category.id}`}
                                            onClick={onClose}
                                            className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            {category.name}
                                            <FiChevronRight className="h-4 w-4 text-gray-400" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            onClick={onClose}
                            className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <FiShoppingCart className="h-5 w-5 text-gray-400" />
                                Giỏ hàng
                            </div>
                            {totalItems > 0 && (
                                <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </nav>

                    {/* User section */}
                    <div className="border-t border-gray-100 p-2 mt-2">
                        {isAuthenticated ? (
                            <>
                                {/* User info */}
                                <div className="px-4 py-3 mb-2">
                                    <p className="font-semibold text-gray-900">{user?.full_name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>

                                {/* Admin link */}
                                {user?.role === 'admin' && (
                                    <Link
                                        href="/admin/dashboard"
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                                    >
                                        <FiShield className="h-5 w-5" />
                                        Quản trị viên
                                    </Link>
                                )}

                                <Link
                                    href="/profile"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FiUser className="h-5 w-5 text-gray-400" />
                                    Tài khoản
                                </Link>
                                <Link
                                    href="/orders"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FiPackage className="h-5 w-5 text-gray-400" />
                                    Đơn hàng
                                </Link>
                                <Link
                                    href="/addresses"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <FiMapPin className="h-5 w-5 text-gray-400" />
                                    Địa chỉ
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                                >
                                    <FiLogOut className="h-5 w-5" />
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <div className="space-y-2 p-2">
                                <Link
                                    href="/login"
                                    onClick={onClose}
                                    className="block w-full px-4 py-2.5 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={onClose}
                                    className="block w-full px-4 py-2.5 text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
