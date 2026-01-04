'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { 
    FiHome, 
    FiShoppingBag, 
    FiPackage, 
    FiUsers, 
    FiGrid,
    FiLogOut,
    FiMenu,
    FiX,
    FiBarChart2
} from 'react-icons/fi';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { label: 'Thống kê', href: '/admin', icon: <FiBarChart2 className="w-5 h-5" /> },
    { label: 'Đơn hàng', href: '/admin/orders', icon: <FiShoppingBag className="w-5 h-5" /> },
    { label: 'Sản phẩm', href: '/admin/products', icon: <FiPackage className="w-5 h-5" /> },
    { label: 'Danh mục', href: '/admin/categories', icon: <FiGrid className="w-5 h-5" /> },
    { label: 'Khách hàng', href: '/admin/customers', icon: <FiUsers className="w-5 h-5" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Redirect if not admin
        if (user && user.role !== 'admin') {
            router.push('/');
        }
    }, [user, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo & Close Button */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                                isActive
                                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t">
                        <div className="mb-3">
                            <p className="text-sm text-gray-600">Đang đăng nhập với</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <FiLogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-gray-100 rounded-md"
                        >
                            <FiMenu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                        <div className="w-10" /> {/* Spacer for alignment */}
                    </div>
                </header>

                {/* Page Content */}
                <main>{children}</main>
            </div>
        </div>
    );
}
