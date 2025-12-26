import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types';

export const cartService = {
    async getCart(): Promise<Cart> {
        const response = await apiClient.get<{ data: Cart }>(API_ENDPOINTS.CART);
        return response.data;
    },

    async addToCart(data: AddToCartRequest): Promise<Cart> {
        const response = await apiClient.post<{ data: Cart }>(API_ENDPOINTS.CART_ITEMS, data);
        return response.data;
    },

    async updateCartItem(id: number, data: UpdateCartItemRequest): Promise<Cart> {
        const response = await apiClient.put<{ data: Cart }>(API_ENDPOINTS.CART_ITEM(id), data);
        return response.data;
    },

    async removeCartItem(id: number): Promise<Cart> {
        const response = await apiClient.delete<{ data: Cart }>(API_ENDPOINTS.CART_ITEM(id));
        return response.data;
    },

    async clearCart(): Promise<Cart> {
        const response = await apiClient.post<{ data: Cart }>(API_ENDPOINTS.CLEAR_CART);
        return response.data;
    },
};
