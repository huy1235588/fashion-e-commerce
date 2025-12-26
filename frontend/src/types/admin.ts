// Admin Types
export interface DashboardStats {
    total_users: number;
    total_products: number;
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    processing_orders: number;
    shipping_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    revenue_this_month: number;
    revenue_last_month: number;
    orders_this_month: number;
    orders_last_month: number;
    new_users_this_month: number;
    new_users_last_month: number;
    low_stock_products: number;
    out_of_stock_products: number;
}

export interface AdminUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}

export interface UpdateUserRoleRequest {
    role: 'user' | 'admin';
}

export interface UpdateOrderStatusRequest {
    status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
}
