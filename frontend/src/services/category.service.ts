import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type { Category } from '@/types';

export interface CreateCategoryInput {
    name: string;
    description?: string;
    slug: string;
}

export interface UpdateCategoryInput {
    name?: string;
    description?: string;
    slug?: string;
}

class CategoryService {
    // Get all categories (public)
    async getCategories(): Promise<Category[]> {
        const response = await apiClient.get<{ data: Category[] }>(API_ENDPOINTS.CATEGORIES);
        return response.data;
    }

    // Get category by ID
    async getCategoryById(id: number): Promise<Category> {
        const response = await apiClient.get<{ data: Category }>(API_ENDPOINTS.CATEGORY_DETAIL(id));
        return response.data;
    }

    // Create category (admin)
    async createCategory(data: CreateCategoryInput): Promise<Category> {
        const response = await apiClient.post<{ data: Category }>(
            API_ENDPOINTS.ADMIN_CATEGORIES,
            data
        );
        return response.data;
    }

    // Update category (admin)
    async updateCategory(id: number, data: UpdateCategoryInput): Promise<Category> {
        const response = await apiClient.put<{ data: Category }>(
            `${API_ENDPOINTS.ADMIN_CATEGORIES}/${id}`,
            data
        );
        return response.data;
    }

    // Delete category (admin)
    async deleteCategory(id: number): Promise<void> {
        await apiClient.delete(`${API_ENDPOINTS.ADMIN_CATEGORIES}/${id}`);
    }
}

export const categoryService = new CategoryService();
