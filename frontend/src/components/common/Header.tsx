'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const { totalItems } = useCart();

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        Fashion Store
                    </Link>

                    <nav className="flex items-center space-x-6">
                        <Link href="/products" className="text-gray-700 hover:text-gray-900">
                            Sản phẩm
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
                                    Giỏ hàng
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/orders" className="text-gray-700 hover:text-gray-900">
                                    Đơn hàng
                                </Link>
                                <Link href="/addresses" className="text-gray-700 hover:text-gray-900">
                                    Địa chỉ
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link href="/admin/dashboard" className="text-purple-600 hover:text-purple-700 font-medium">
                                        Quản trị
                                    </Link>
                                )}
                                <Link href="/profile" className="text-gray-700 hover:text-gray-900">
                                    {user?.full_name}
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
