import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types';

export const cartService = {
    async getCart(): Promise<Cart> {
        const response = await apiClient.get<Cart>(API_ENDPOINTS.CART);
        return response.data!;
    },

    async addToCart(data: AddToCartRequest): Promise<Cart> {
        const response = await apiClient.post<Cart>(API_ENDPOINTS.CART_ITEMS, data);
        return response.data!;
    },

    async updateCartItem(id: number, data: UpdateCartItemRequest): Promise<Cart> {
        const response = await apiClient.put<Cart>(API_ENDPOINTS.CART_ITEM(id), data);
        return response.data!;
    },

    async removeCartItem(id: number): Promise<Cart> {
        const response = await apiClient.delete<Cart>(API_ENDPOINTS.CART_ITEM(id));
        return response.data!;
    },

    async clearCart(): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.CLEAR_CART);
    },
};
