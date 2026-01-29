'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
    FiUser, 
    FiPackage, 
    FiMapPin, 
    FiHeart, 
    FiSettings, 
    FiLogOut,
    FiShield,
    FiChevronDown
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface UserMenuProps {
    className?: string;
}

export default function UserMenu({ className }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const menuItems = [
        { href: '/profile', icon: FiUser, label: 'Thông tin tài khoản' },
        { href: '/orders', icon: FiPackage, label: 'Đơn hàng của tôi' },
        { href: '/addresses', icon: FiMapPin, label: 'Sổ địa chỉ' },
        // { href: '/wishlist', icon: FiHeart, label: 'Yêu thích' },
    ];

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    // Get initials from user name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div ref={menuRef} className={cn('relative', className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-full transition-colors',
                    'hover:bg-gray-100',
                    isOpen && 'bg-gray-100'
                )}
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user?.full_name ? getInitials(user.full_name) : <FiUser className="h-4 w-4" />}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 max-w-24 truncate">
                    {user?.full_name || 'Tài khoản'}
                </span>
                <FiChevronDown className={cn(
                    'hidden md:block h-4 w-4 text-gray-500 transition-transform duration-200',
                    isOpen && 'rotate-180'
                )} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-dropdown animate-fade-in">
                    {/* User info header */}
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{user?.full_name}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>

                    {/* Admin link */}
                    {user?.role === 'admin' && (
                        <div className="p-2 border-b border-gray-100">
                            <Link
                                href="/admin/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                            >
                                <FiShield className="h-5 w-5" />
                                Quản trị viên
                            </Link>
                        </div>
                    )}

                    {/* Menu items */}
                    <div className="p-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <item.icon className="h-5 w-5 text-gray-400" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                        >
                            <FiLogOut className="h-5 w-5" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
