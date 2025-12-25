// Product Types
export interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    discount_price?: number;
    slug: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    images?: ProductImage[];
    variants?: ProductVariant[];
    category?: Category;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_url: string;
    is_primary: boolean;
    created_at: string;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    size: string;
    color: string;
    stock_quantity: number;
    sku: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

export interface ProductListParams {
    page?: number;
    limit?: number;
    category_id?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export interface ProductListResponse {
    data: Product[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}
