import api from '@/lib/api';
import { DashboardStats, AdminUser, UpdateUserRoleRequest, UpdateOrderStatusRequest } from '@/types/admin';
import { Order } from '@/types/order';

export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<{ data: DashboardStats }>('/admin/dashboard/stats');
    return response.data;
  },

  // User Management
  getAllUsers: async (page: number = 1, limit: number = 20): Promise<{ data: AdminUser[]; pagination: any }> => {
    const response = await api.get<{ data: AdminUser[]; pagination: any }>('/admin/users', {
      params: { page, limit }
    });
    return response;
  },

  updateUserRole: async (userId: number, data: UpdateUserRoleRequest): Promise<void> => {
    await api.put(`/admin/users/${userId}/role`, data);
  },

  // Order Management
  getAllOrders: async (page: number = 1, limit: number = 20, status?: string): Promise<{ data: Order[]; pagination: any }> => {
    const response = await api.get<{ data: Order[]; pagination: any }>('/admin/orders', {
      params: { page, limit, status }
    });
    return response;
  },

  updateOrderStatus: async (orderId: number, data: UpdateOrderStatusRequest): Promise<void> => {
    await api.put(`/admin/orders/${orderId}/status`, data);
  }
};
