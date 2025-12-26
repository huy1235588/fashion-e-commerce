import { useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cart.service';
import { useAuth } from './useAuth';
import type { AddToCartRequest } from '@/types';

export function useCart() {
    const { cart, isLoading, setCart, clearCart, setLoading } = useCartStore();
    const { isAuthenticated } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            clearCart();
            return;
        }

        try {
            setLoading(true);
            const fetchedCart = await cartService.getCart();
            setCart(fetchedCart);
        } catch (error) {
            console.error('Fetch cart error:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, setCart, setLoading, clearCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleAddToCart = async (data: AddToCartRequest) => {
        try {
            setLoading(true);
            const updatedCart = await cartService.addToCart(data);
            setCart(updatedCart);
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCartItem = async (id: number, quantity: number) => {
        try {
            setLoading(true);
            const updatedCart = await cartService.updateCartItem(id, { quantity });
            setCart(updatedCart);
        } catch (error) {
            console.error('Update cart item error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCartItem = async (id: number) => {
        try {
            setLoading(true);
            const updatedCart = await cartService.removeCartItem(id);
            setCart(updatedCart);
        } catch (error) {
            console.error('Remove cart item error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleClearCart = async () => {
        try {
            setLoading(true);
            await cartService.clearCart();
            clearCart();
        } catch (error) {
            console.error('Clear cart error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        cart,
        items: cart?.items || [],
        isLoading,
        totalItems: cart?.item_count || 0,
        totalPrice: cart?.total || 0,
        subtotal: cart?.subtotal || 0,
        addToCart: handleAddToCart,
        updateCartItem: handleUpdateCartItem,
        removeCartItem: handleRemoveCartItem,
        clearCart: handleClearCart,
        refreshCart: fetchCart,
    };
}
