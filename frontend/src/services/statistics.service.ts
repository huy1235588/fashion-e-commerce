import { apiClient } from '@/lib/api';

export interface DashboardStats {
    total_revenue: number;
    total_orders: number;
    total_users: number;
    total_products: number;
    revenue_today: number;
    orders_today: number;
    pending_orders: number;
}

export interface RevenueData {
    date: string;
    revenue: number;
}

export interface TopProduct {
    product_id: number;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
}

export interface OrderStatusStat {
    status: string;
    count: number;
}

export interface CustomerGrowth {
    period: string;
    new_customers: number;
}

export interface CategoryRevenue {
    category_id: number;
    category_name: string;
    total_revenue: number;
    order_count: number;
}

class StatisticsService {
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await apiClient.get('/admin/statistics/dashboard');
        return response.data;
    }

    async getRevenueByPeriod(startDate: string, endDate: string): Promise<RevenueData[]> {
        const response = await apiClient.get('/admin/statistics/revenue', {
            params: { start_date: startDate, end_date: endDate },
        });
        return response.data;
    }

    async getTopSellingProducts(limit: number = 10): Promise<TopProduct[]> {
        const response = await apiClient.get('/admin/statistics/products/top', {
            params: { limit },
        });
        return response.data;
    }

    async getOrderStatsByStatus(): Promise<OrderStatusStat[]> {
        const response = await apiClient.get('/admin/statistics/orders');
        return response.data;
    }

    async getCustomerGrowth(period: string = 'daily', limit: number = 30): Promise<CustomerGrowth[]> {
        const response = await apiClient.get('/admin/statistics/customers', {
            params: { period, limit },
        });
        return response.data;
    }

    async getRevenueByCategory(): Promise<CategoryRevenue[]> {
        const response = await apiClient.get('/admin/statistics/categories/revenue');
        return response.data;
    }
}

export const statisticsService = new StatisticsService();
