'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiEye, FiShoppingCart, FiStar } from 'react-icons/fi';
import { formatCurrency, getImageUrl, cn } from '@/lib/utils';
import { Badge } from '@/components/ui';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
    showQuickActions?: boolean;
    showRating?: boolean;
}

export default function ProductCard({ 
    product, 
    showQuickActions = true,
    showRating = true 
}: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [imageError, setImageError] = useState(false);

    const primaryImage = product.images?.find((img) => img.is_primary);
    const imageUrl = primaryImage ? getImageUrl(primaryImage.image_url) : '/placeholder.png';
    const hasDiscount = product.discount_price && product.discount_price < product.price;
    
    // Calculate discount percentage
    const discountPercent = hasDiscount 
        ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
        : 0;

    // Check if product is new (created within 7 days)
    const isNew = product.created_at 
        ? new Date().getTime() - new Date(product.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
        : false;

    // Stock status - check variants if available
    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) ?? 0;
    const hasVariants = product.variants && product.variants.length > 0;
    const isOutOfStock = hasVariants && totalStock === 0;
    const isLowStock = hasVariants && totalStock > 0 && totalStock <= 5;

    // Mock rating (in real app, this would come from product data)
    const rating = 4.5;
    const reviewCount = 12;

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Open quick view modal
        console.log('Quick view:', product.id);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Add to cart logic
        console.log('Add to cart:', product.id);
    };

    return (
        <Link href={`/products/${product.id}`} className="group block">
            <div className={cn(
                'bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300',
                'hover:shadow-xl hover:-translate-y-1',
                isOutOfStock && 'opacity-75'
            )}>
                {/* Image container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                        src={imageError ? '/placeholder.png' : getImageUrl(imageUrl)}
                        alt={product.name}
                        fill
                        className={cn(
                            'object-cover transition-transform duration-500',
                            'group-hover:scale-105',
                            isOutOfStock && 'grayscale'
                        )}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

                    {/* Wishlist button */}
                    <button
                        onClick={handleWishlistClick}
                        className={cn(
                            'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
                            'bg-white/90 backdrop-blur-sm shadow-sm',
                            'hover:bg-white hover:scale-110',
                            isWishlisted ? 'text-error-500' : 'text-gray-600'
                        )}
                    >
                        <FiHeart 
                            className={cn('w-5 h-5', isWishlisted && 'fill-current')} 
                        />
                    </button>

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="secondary" size="lg" className="font-bold">
                                Hết hàng
                            </Badge>
                        </div>
                    )}

                    {/* Quick actions on hover */}
                    {showQuickActions && !isOutOfStock && (
                        <div className={cn(
                            'absolute inset-x-0 bottom-0 p-3',
                            'translate-y-full opacity-0 transition-all duration-300',
                            'group-hover:translate-y-0 group-hover:opacity-100'
                        )}>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleQuickView}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-medium rounded-lg hover:bg-white transition-colors shadow-lg"
                                >
                                    <FiEye className="w-4 h-4" />
                                    Xem nhanh
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                                >
                                    <FiShoppingCart className="w-4 h-4" />
                                    Thêm
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Product name */}
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors min-h-10">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {showRating && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={cn(
                                            'w-3.5 h-3.5',
                                            i < Math.floor(rating)
                                                ? 'text-yellow-400 fill-current'
                                                : i < rating
                                                ? 'text-yellow-400 fill-current opacity-50'
                                                : 'text-gray-300'
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">
                                ({reviewCount})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {hasDiscount ? (
                            <>
                                <span className="text-lg font-bold text-primary-600">
                                    {formatCurrency(product.discount_price!)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    {formatCurrency(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">
                                {formatCurrency(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Low stock warning */}
                    {isLowStock && (
                        <p className="mt-2 text-xs text-warning-600 font-medium">
                            Chỉ còn {totalStock} sản phẩm
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
