import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart } from '@/types';

interface CartState {
    cart: Cart | null;
    isLoading: boolean;
    setCart: (cart: Cart) => void;
    clearCart: () => void;
    setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: null,
            isLoading: false,

            setCart: (cart) => set({ cart }),

            clearCart: () => set({ cart: null }),

            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ cart: state.cart }),
        }
    )
);
