'use client';

import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={cn('flex items-center text-sm', className)} aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-1">
                <li>
                    <Link
                        href="/"
                        className="flex items-center text-gray-500 hover:text-primary-600 transition-colors"
                    >
                        <FiHome className="w-4 h-4" />
                        <span className="sr-only">Trang chủ</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <FiChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-gray-500 hover:text-primary-600 transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-medium">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
