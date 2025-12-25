import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    isLoading: boolean;
    setItems: (items: CartItem[]) => void;
    addItem: (item: CartItem) => void;
    updateItem: (id: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    setLoading: (loading: boolean) => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,

            setItems: (items) => set({ items }),

            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),

            updateItem: (id, quantity) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                })),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                })),

            clearCart: () => set({ items: [] }),

            setLoading: (loading) => set({ isLoading: loading }),

            getTotalItems: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
