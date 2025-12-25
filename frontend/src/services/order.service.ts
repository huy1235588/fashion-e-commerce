import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Order, CreateOrderRequest, OrderListParams, OrderListResponse } from '@/types';

export const orderService = {
    async getOrders(params?: OrderListParams): Promise<OrderListResponse> {
        const response = await apiClient.get<OrderListResponse>(API_ENDPOINTS.ORDERS, {
            params,
        });
        return response.data!;
    },

    async getOrderById(id: number): Promise<Order> {
        const response = await apiClient.get<Order>(API_ENDPOINTS.ORDER_DETAIL(id));
        return response.data!;
    },

    async createOrder(data: CreateOrderRequest): Promise<Order> {
        const response = await apiClient.post<Order>(API_ENDPOINTS.ORDERS, data);
        return response.data!;
    },

    async cancelOrder(id: number): Promise<Order> {
        const response = await apiClient.put<Order>(API_ENDPOINTS.CANCEL_ORDER(id));
        return response.data!;
    },
};
