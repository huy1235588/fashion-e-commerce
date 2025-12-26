import api from '@/lib/api';
import type { Order, CreateOrderRequest, CancelOrderRequest, UpdateOrderStatusRequest } from '@/types';

export const orderService = {
    // Create a new order from cart
    async createOrder(data: CreateOrderRequest): Promise<Order> {
        const response = await api.post<{ data: Order }>('/orders', data);
        if (!response.data) throw new Error('Failed to create order');
        return response.data;
    },

    // Get all orders for the current user
    async getMyOrders(page: number = 1, limit: number = 10): Promise<{ orders: Order[]; total: number }> {
        const response = await api.get<{ data: Order[]; pagination?: { total: number } }>(`/orders?page=${page}&limit=${limit}`);
        const orders = response.data ?? [];
        
        // Extract pagination from response if available
        const total = response.pagination?.total ?? orders.length;
        
        return { orders, total };
    },

    // Get a specific order by ID
    async getOrderById(id: number): Promise<Order> {
        const response = await api.get<{ data: Order }>(`/orders/${id}`);
        if (!response.data) throw new Error('Order not found');
        return response.data;
    },

    // Cancel an order
    async cancelOrder(id: number, data: CancelOrderRequest): Promise<void> {
        await api.post(`/orders/${id}/cancel`, data);
    },

    // Admin: Get all orders with filters
    async getAllOrders(filters?: {
        page?: number;
        limit?: number;
        status?: string;
        payment_status?: string;
        payment_method?: string;
    }): Promise<{ orders: Order[]; total: number }> {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.status) params.append('status', filters.status);
        if (filters?.payment_status) params.append('payment_status', filters.payment_status);
        if (filters?.payment_method) params.append('payment_method', filters.payment_method);

        const response = await api.get<{ data: Order[]; pagination?: { total: number } }>(`/admin/orders?${params.toString()}`);
        const orders = response.data ?? [];
        const total = response.pagination?.total ?? orders.length;
        
        return { orders, total };
    },

    // Admin: Update order status
    async updateOrderStatus(id: number, data: UpdateOrderStatusRequest): Promise<void> {
        await api.put(`/admin/orders/${id}/status`, data);
    },
};
