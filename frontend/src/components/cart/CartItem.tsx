'use client';

import Image from 'next/image';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const imageUrl = item.product?.images?.[0]?.image_url
        ? getImageUrl(item.product.images[0].image_url)
        : '/placeholder.png';

    const subtotal = item.price * item.quantity;

    return (
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow">
            <div className="relative h-24 w-24 shrink-0">
                <Image
                    src={getImageUrl(imageUrl)}
                    alt={item.product?.name || 'Product'}
                    fill
                    className="object-cover rounded"
                    sizes="96px"
                />
            </div>

            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.product?.name}</h3>
                <p className="text-sm text-gray-600">
                    {item.variant?.size} - {item.variant?.color}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                    {formatCurrency(item.price)}
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                >
                    -
                </button>
                <span className="px-4 py-1 border border-gray-300 rounded">{item.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
                    disabled={(item.variant?.stock_quantity || 0) <= item.quantity}
                >
                    +
                </button>
            </div>

            <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatCurrency(subtotal)}</p>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-sm text-red-600 hover:text-red-800 mt-2"
                >
                    Xóa
                </button>
            </div>
        </div>
    );
}
