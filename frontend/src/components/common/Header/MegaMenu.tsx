'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiGrid } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface MegaMenuProps {
    categories: Category[];
    isOpen: boolean;
    onClose: () => void;
}

export default function MegaMenu({ categories, isOpen, onClose }: MegaMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Split categories into columns
    const midPoint = Math.ceil(categories.length / 2);
    const leftColumn = categories.slice(0, midPoint);
    const rightColumn = categories.slice(midPoint);

    return (
        <div 
            ref={menuRef}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 animate-fade-in z-dropdown"
        >
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Categories columns */}
                    <div className="md:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Danh mục sản phẩm
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                            <div className="space-y-3">
                                {leftColumn.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/products?category=${category.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group"
                                    >
                                        <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                            <FiGrid className="h-4 w-4 text-gray-500 group-hover:text-primary-600" />
                                        </span>
                                        <span className="font-medium">{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="space-y-3">
                                {rightColumn.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/products?category=${category.id}`}
                                        onClick={onClose}
                                        className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group"
                                    >
                                        <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                                            <FiGrid className="h-4 w-4 text-gray-500 group-hover:text-primary-600" />
                                        </span>
                                        <span className="font-medium">{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Featured section */}
                    <div className="hidden md:block">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Nổi bật
                        </h3>
                        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white">
                            <h4 className="text-lg font-bold mb-2">Khuyến mãi mùa hè</h4>
                            <p className="text-sm text-primary-100 mb-4">
                                Giảm giá đến 50% cho tất cả sản phẩm
                            </p>
                            <Link 
                                href="/products" 
                                onClick={onClose}
                                className="inline-block bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Mua ngay
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick links */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                    <Link
                        href="/products"
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        Tất cả sản phẩm
                    </Link>
                    <Link
                        href="/products?sort=newest"
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        Hàng mới về
                    </Link>
                    <Link
                        href="/products?sale=true"
                        onClick={onClose}
                        className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                        Khuyến mãi
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Trigger component for MegaMenu
interface MegaMenuTriggerProps {
    isOpen: boolean;
    onClick: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export function MegaMenuTrigger({ isOpen, onClick, onMouseEnter, onMouseLeave }: MegaMenuTriggerProps) {
    return (
        <button
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn(
                'flex items-center gap-1 text-gray-700 hover:text-primary-600 transition-colors font-medium',
                isOpen && 'text-primary-600'
            )}
        >
            Danh mục
            <FiChevronDown className={cn(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'rotate-180'
            )} />
        </button>
    );
}
