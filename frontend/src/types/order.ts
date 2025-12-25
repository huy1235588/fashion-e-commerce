// Order Types
export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'vnpay' | 'momo';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order {
    id: number;
    user_id: number;
    order_code: string;
    total_amount: number;
    shipping_fee: number;
    discount_amount: number;
    final_amount: number;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    status: OrderStatus;
    note?: string;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
    shipping_address?: ShippingAddress;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    variant_id: number;
    product_name: string;
    variant_info: string;
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
