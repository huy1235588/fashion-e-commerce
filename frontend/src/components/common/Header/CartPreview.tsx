'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { cn, formatCurrency, getImageUrl } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui';

interface CartPreviewProps {
    className?: string;
}

export default function CartPreview({ className }: CartPreviewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { items, totalItems, totalPrice, removeCartItem } = useCart();
    const previewRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={previewRef}
            className={cn('relative', className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <FiShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems > 9 ? '9+' : totalItems}
                    </span>
                )}
            </Link>

            {/* Preview popup */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-dropdown animate-fade-in">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">
                            Giỏ hàng ({totalItems})
                        </h3>
                    </div>

                    {items.length === 0 ? (
                        <div className="p-6 text-center">
                            <FiShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">Giỏ hàng trống</p>
                            <Link
                                href="/products"
                                className="inline-block mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Tiếp tục mua sắm →
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-64 overflow-y-auto">
                                {items.slice(0, 3).map((item) => (
                                    <div
                                        key={`${item.product_id}-${item.variant_id || 'default'}`}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={getImageUrl(item.product?.images?.[0]?.image_url)}
                                                alt={item.product?.name || 'Product'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.product?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.variant?.size && `Size: ${item.variant.size} • `}
                                                SL: {item.quantity}
                                            </p>
                                            <p className="text-sm font-semibold text-primary-600">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeCartItem(item.id);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-error-500 hover:bg-error-50 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                {items.length > 3 && (
                                    <div className="px-3 py-2 text-center">
                                        <span className="text-sm text-gray-500">
                                            và {items.length - 3} sản phẩm khác...
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-gray-600">Tạm tính:</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatCurrency(totalPrice)}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href="/cart">
                                        <Button variant="outline" fullWidth size="sm">
                                            Xem giỏ hàng
                                        </Button>
                                    </Link>
                                    <Link href="/checkout">
                                        <Button fullWidth size="sm">
                                            Thanh toán
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
