import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Product, ProductListParams, ProductListResponse, Category } from '@/types';

export const productService = {
    async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
        const response = await apiClient.get<ProductListResponse>(API_ENDPOINTS.PRODUCTS, {
            params,
        });
        return response.data!;
    },

    async getProductById(id: number): Promise<Product> {
        const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCT_DETAIL(id));
        return response.data!;
    },

    async getProductBySlug(slug: string): Promise<Product> {
        const response = await apiClient.get<Product>(`${API_ENDPOINTS.PRODUCTS}/${slug}`);
        return response.data!;
    },

    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES);
        return response.data!;
    },

    async getCategoryById(id: number): Promise<Category> {
        const response = await apiClient.get<Category>(API_ENDPOINTS.CATEGORY_DETAIL(id));
        return response.data!;
    },
};
