import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Product, ProductListParams, ProductListResponse, Category } from '@/types';

export const productService = {
    async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
        const queryParams: any = {};
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.page_size = params.limit;
        if (params?.category_id) queryParams.category_id = params.category_id;
        if (params?.search) queryParams.search = params.search;
        if (params?.min_price) queryParams.min_price = params.min_price;
        if (params?.max_price) queryParams.max_price = params.max_price;

        const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS, {
            params: queryParams,
        });
        
        // Transform backend response to match frontend type
        return {
            data: response.data.data || [],
            total: response.data.pagination?.total || 0,
            page: response.data.pagination?.page || 1,
            limit: response.data.pagination?.page_size || 20,
            total_pages: response.data.pagination?.pages || 0,
        };
    },

    async getProductById(id: number): Promise<Product> {
        const response = await apiClient.get<any>(API_ENDPOINTS.PRODUCT_DETAIL(id));
        return response.data.data;
    },

    async getProductBySlug(slug: string): Promise<Product> {
        const response = await apiClient.get<any>(`${API_ENDPOINTS.PRODUCTS}/slug/${slug}`);
        return response.data.data;
    },

    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<any>(API_ENDPOINTS.CATEGORIES);
        return response.data.data || [];
    },

    async getCategoryById(id: number): Promise<Category> {
        const response = await apiClient.get<any>(API_ENDPOINTS.CATEGORY_DETAIL(id));
        return response.data.data;
    },
};
