// Cart Types
export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    variant_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    created_at: string;
    updated_at: string;
    product?: {
        id: number;
        name: string;
        slug: string;
        images?: { image_url: string; is_primary: boolean }[];
    };
    variant?: {
        id: number;
        size: string;
        color: string;
        stock_quantity: number;
    };
}

export interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
    subtotal: number;
    total: number;
    item_count: number;
    created_at: string;
    updated_at: string;
}

export interface AddToCartRequest {
    product_id: number;
    variant_id: number;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
