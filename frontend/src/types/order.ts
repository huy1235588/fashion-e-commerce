// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'vnpay' | 'momo';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
    id: number;
    order_code: string;
    user_id: number;
    status: OrderStatus;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    subtotal_amount: number;
    shipping_fee: number;
    total_amount: number;
    note?: string;
    cancel_reason?: string;
    shipping_full_name: string;
    shipping_phone: string;
    shipping_province: string;
    shipping_district: string;
    shipping_ward: string;
    shipping_detail_address: string;
    order_items?: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    product_id: number;
    variant_id?: number;
    product_name: string;
    variant_name?: string;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: string;
}

export interface ShippingAddress {
    id: number;
    order_id: number;
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail_address: string;
    created_at: string;
}

export interface CreateOrderRequest {
    address_id: number;
    payment_method: PaymentMethod;
    note?: string;
}

export interface OrderListParams {
    page?: number;
    limit?: number;
    status?: OrderStatus;
}

export interface OrderListResponse {
    data: Order[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface CancelOrderRequest {
    reason: string;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}
