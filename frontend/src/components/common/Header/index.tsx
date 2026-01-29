'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { productService } from '@/services/product.service';
import { Category } from '@/types';
import { Button } from '@/components/ui';

import SearchBar from './SearchBar';
import MegaMenu, { MegaMenuTrigger } from './MegaMenu';
import CartPreview from './CartPreview';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';

export default function Header() {
    const { isAuthenticated } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await productService.getCategories();
                setCategories(cats);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        loadCategories();
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 z-sticky transition-all duration-300',
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-md'
                        : 'bg-white shadow-sm'
                )}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16 lg:h-18">
                        {/* Left section: Logo + Mobile menu */}
                        <div className="flex items-center gap-2">
                            {/* Mobile menu toggle */}
                            <button
                                onClick={() => setIsMobileDrawerOpen(true)}
                                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Menu"
                            >
                                <FiMenu className="h-6 w-6" />
                            </button>

                            {/* Logo */}
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                                <span className="bg-primary-600 text-white px-2 py-1 rounded-lg text-sm lg:text-base">
                                    F
                                </span>
                                <span className="hidden sm:inline">Fashion Store</span>
                            </Link>
                        </div>

                        {/* Center section: Navigation + Search (Desktop) */}
                        <div className="hidden lg:flex items-center gap-8 flex-1 justify-center max-w-2xl mx-8">
                            {/* Navigation */}
                            <nav className="flex items-center gap-6">
                                <Link
                                    href="/products"
                                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                                >
                                    Sản phẩm
                                </Link>
                                <div className="relative">
                                    <MegaMenuTrigger
                                        isOpen={isMegaMenuOpen}
                                        onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                                    />
                                </div>
                            </nav>

                            {/* Search bar */}
                            <SearchBar className="flex-1 max-w-md" />
                        </div>

                        {/* Right section: Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Mobile search toggle */}
                            <button
                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Search"
                            >
                                {isMobileSearchOpen ? (
                                    <FiX className="h-5 w-5" />
                                ) : (
                                    <FiSearch className="h-5 w-5" />
                                )}
                            </button>

                            {/* Cart */}
                            <CartPreview />

                            {/* Auth buttons / User menu */}
                            {isAuthenticated ? (
                                <UserMenu />
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm">
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile search bar */}
                    <div
                        className={cn(
                            'lg:hidden overflow-hidden transition-all duration-300',
                            isMobileSearchOpen ? 'max-h-20 pb-4' : 'max-h-0'
                        )}
                    >
                        <SearchBar autoFocus={isMobileSearchOpen} />
                    </div>
                </div>

                {/* Mega menu */}
                <MegaMenu
                    categories={categories}
                    isOpen={isMegaMenuOpen}
                    onClose={() => setIsMegaMenuOpen(false)}
                />
            </header>

            {/* Mobile drawer */}
            <MobileDrawer
                isOpen={isMobileDrawerOpen}
                onClose={() => setIsMobileDrawerOpen(false)}
                categories={categories}
            />
        </>
    );
}
