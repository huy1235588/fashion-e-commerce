'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const primaryImage = product.images?.find((img) => img.is_primary);
    const imageUrl = primaryImage ? getImageUrl(primaryImage.image_url) : '/placeholder.png';
    const hasDiscount = product.discount_price && product.discount_price < product.price;

    return (
        <Link href={`/products/${product.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64 w-full">
                    <Image
                        src={getImageUrl(imageUrl)}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                            -{Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                    </h3>

                    <div className="flex items-center space-x-2">
                        {hasDiscount ? (
                            <>
                                <span className="text-xl font-bold text-red-600">
                                    {formatCurrency(product.discount_price!)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    {formatCurrency(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-900">
                                {formatCurrency(product.price)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
