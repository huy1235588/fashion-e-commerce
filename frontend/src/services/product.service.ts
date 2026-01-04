import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Product, ProductListParams, ProductListResponse, Category } from '@/types';

// Backend response types
interface BackendPagination {
    page: number;
    page_size: number;
    total: number;
    pages: number;
}

interface BackendProductListResponse {
    data: Product[];
    pagination: BackendPagination;
}

export const productService = {
    async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
        const queryParams: any = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.page_size = params.limit;
        if (params?.category_id) queryParams.category_id = params.category_id;
        if (params?.search) queryParams.search = params.search;
        if (params?.min_price) queryParams.min_price = params.min_price;
        if (params?.max_price) queryParams.max_price = params.max_price;

        const response = await apiClient.get<BackendProductListResponse>(API_ENDPOINTS.PRODUCTS, {
            params: queryParams,
        });
        
        // Transform backend response to match frontend type
        return {
            data: response.data || [],
            total: response.pagination?.total || 0,
            page: response.pagination?.page || 1,
            limit: response.pagination?.page_size || 20,
            total_pages: response.pagination?.pages || 0,
        };
    },

    async getProductById(id: number): Promise<Product> {
        const response = await apiClient.get<{ data: Product }>(API_ENDPOINTS.PRODUCT_DETAIL(id));
        return response.data;
    },

    async getProductBySlug(slug: string): Promise<Product> {
        const response = await apiClient.get<{ data: Product }>(`${API_ENDPOINTS.PRODUCTS}/slug/${slug}`);
        return response.data;
    },

    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<{ data: Category[] }>(API_ENDPOINTS.CATEGORIES);
        return response.data || [];
    },

    async getCategoryById(id: number): Promise<Category> {
        const response = await apiClient.get<{ data: Category }>(API_ENDPOINTS.CATEGORY_DETAIL(id));
        return response.data;
    },

    async deleteProduct(id: number): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.PRODUCT_DETAIL(id));
    },

    async createProduct(data: CreateProductRequest): Promise<Product> {
        const response = await apiClient.post<{ data: Product }>(
            API_ENDPOINTS.ADMIN_PRODUCTS,
            data
        );
        return response.data;
    },

    async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
        const response = await apiClient.put<{ data: Product }>(
            `${API_ENDPOINTS.ADMIN_PRODUCTS}/${id}`,
            product
        );
        return response.data;
    },

    async addProductImage(productId: number, imageUrl: string, isPrimary: boolean): Promise<void> {
        await apiClient.post(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}/images`, {
            image_url: imageUrl,
            is_primary: isPrimary,
        });
    },

    async deleteProductImage(productId: number, imageId: number): Promise<void> {
        await apiClient.delete(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}/images/${imageId}`);
    },

    async addProductVariant(productId: number, variant: {
        size: string;
        color: string;
        stock_quantity: number;
        sku: string;
    }): Promise<void> {
        await apiClient.post(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}/variants`, variant);
    },

    async updateProductVariant(productId: number, variantId: number, variant: {
        size: string;
        color: string;
        stock_quantity: number;
        sku: string;
    }): Promise<void> {
        await apiClient.put(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}/variants/${variantId}`, variant);
    },

    async deleteProductVariant(productId: number, variantId: number): Promise<void> {
        await apiClient.delete(`${API_ENDPOINTS.ADMIN_PRODUCTS}/${productId}/variants/${variantId}`);
    },
};

// Types for product creation
export interface CreateProductRequest {
    product: {
        name: string;
        description: string;
        category_id: number;
        price: number;
        discount_price?: number;
        slug: string;
        is_active: boolean;
    };
    variants: Array<{
        size: string;
        color: string;
        stock_quantity: number;
        sku: string;
    }>;
    images: Array<{
        image_url: string;
        is_primary: boolean;
    }>;
}
