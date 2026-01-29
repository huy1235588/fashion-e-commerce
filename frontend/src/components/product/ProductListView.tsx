'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { formatCurrency, getImageUrl, cn } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';
import type { Product } from '@/types';

interface ProductListViewProps {
    product: Product;
}

export default function ProductListView({ product }: ProductListViewProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState(false);

    const primaryImage = product.images?.find((img) => img.is_primary);
    const imageUrl = primaryImage ? getImageUrl(primaryImage.image_url) : '/placeholder.png';
    const hasDiscount = product.discount_price && product.discount_price < product.price;
    
    const discountPercent = hasDiscount 
        ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
        : 0;

    const isNew = product.created_at 
        ? new Date().getTime() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
        : false;

    // Stock status - check variants if available
    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) ?? 0;
    const hasVariants = product.variants && product.variants.length > 0;
    const isOutOfStock = hasVariants && totalStock === 0;
    const isLowStock = hasVariants && totalStock > 0 && totalStock <= 5;

    const rating = 4.5;
    const reviewCount = 12;

    return (
        <div className={cn(
            'group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300',
            'hover:shadow-lg',
            isOutOfStock && 'opacity-75'
        )}>
            <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <Link 
                    href={`/products/${product.id}`}
                    className="relative w-full sm:w-48 md:w-56 aspect-square sm:aspect-auto sm:h-48 overflow-hidden bg-gray-100 shrink-0"
                >
                    <Image
                        src={imageError ? '/placeholder.png' : getImageUrl(imageUrl)}
                        alt={product.name}
                        fill
                        className={cn(
                            'object-cover transition-transform duration-500',
                            'group-hover:scale-105',
                            isOutOfStock && 'grayscale'
                        )}
                        sizes="(max-width: 640px) 100vw, 224px"
                        onError={() => setImageError(true)}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {hasDiscount && (
                            <Badge variant="error" size="sm" className="font-bold">
                                -{discountPercent}%
                            </Badge>
                        )}
                        {isNew && !hasDiscount && (
                            <Badge variant="success" size="sm" className="font-bold">
                                Mới
                            </Badge>
                        )}
                    </div>

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="secondary" size="lg" className="font-bold">
                                Hết hàng
                            </Badge>
                        </div>
                    )}
                </Link>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                    <div className="flex-1">
                        {/* Title */}
                        <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={cn(
                                            'w-4 h-4',
                                            i < Math.floor(rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">
                                ({reviewCount} đánh giá)
                            </span>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {product.description}
                            </p>
                        )}

                        {/* Low stock warning */}
                        {isLowStock && (
                            <p className="text-xs text-warning-600 font-medium mb-2">
                                Chỉ còn {totalStock} sản phẩm
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-4 pt-3 border-t border-gray-100">
                        {/* Price */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {hasDiscount ? (
                                <>
                                    <span className="text-xl font-bold text-primary-600">
                                        {formatCurrency(product.discount_price!)}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        {formatCurrency(product.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-bold text-gray-900">
                                    {formatCurrency(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsWishlisted(!isWishlisted);
                                }}
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center border transition-all',
                                    isWishlisted 
                                        ? 'border-error-500 text-error-500 bg-error-50' 
                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                )}
                            >
                                <FiHeart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                            </button>
                            {!isOutOfStock && (
                                <Button size="sm" className="gap-2">
                                    <FiShoppingCart className="w-4 h-4" />
                                    <span className="hidden md:inline">Thêm vào giỏ</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
