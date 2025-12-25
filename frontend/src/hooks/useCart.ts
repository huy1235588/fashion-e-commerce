import { useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cart.service';
import { useAuth } from './useAuth';
import type { AddToCartRequest } from '@/types';

export function useCart() {
    const { items, isLoading, setItems, addItem, updateItem, removeItem, clearCart, setLoading, getTotalItems, getTotalPrice } =
        useCartStore();
    const { isAuthenticated } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            clearCart();
            return;
        }

        try {
            setLoading(true);
            const cart = await cartService.getCart();
            setItems(cart.items || []);
        } catch (error) {
            console.error('Fetch cart error:', error);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, setItems, setLoading, clearCart]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleAddToCart = async (data: AddToCartRequest) => {
        try {
            setLoading(true);
            const cart = await cartService.addToCart(data);
            setItems(cart.items || []);
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
            const cart = await cartService.updateCartItem(id, { quantity });
            setItems(cart.items || []);
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
            const cart = await cartService.removeCartItem(id);
            setItems(cart.items || []);
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
        items,
        isLoading,
        totalItems: getTotalItems(),
        totalPrice: getTotalPrice(),
        addToCart: handleAddToCart,
        updateCartItem: handleUpdateCartItem,
        removeCartItem: handleRemoveCartItem,
        clearCart: handleClearCart,
        refreshCart: fetchCart,
    };
}
