'use client';

import { useRouter } from 'next/navigation';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Loading from '@/components/common/Loading';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function CartPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { items, isLoading, totalPrice, updateCartItem, removeCartItem } = useCart();

    if (!isAuthenticated) {
        router.push('/login');
        return null;
    }

    if (isLoading) return <Loading />;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
                    <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateCartItem}
                            onRemove={removeCartItem}
                        />
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <CartSummary
                        subtotal={totalPrice}
                        onCheckout={() => router.push('/checkout')}
                    />
                </div>
            </div>
        </div>
    );
}
