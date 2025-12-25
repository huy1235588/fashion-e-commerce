import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
    Address
} from '@/types';

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);
        if (response.data?.token) {
            apiClient.setToken(response.data.token);
        }
        return response.data!;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, data);
        if (response.data?.token) {
            apiClient.setToken(response.data.token);
        }
        return response.data!;
    },

    async logout(): Promise<void> {
        apiClient.clearToken();
    },

    async forgotPassword(email: string): Promise<void> {
        await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
    },

    async resetPassword(token: string, password: string): Promise<void> {
        await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, { token, password });
    },

    async getProfile(): Promise<User> {
        const response = await apiClient.get<User>(API_ENDPOINTS.PROFILE);
        return response.data!;
    },

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await apiClient.put<User>(API_ENDPOINTS.PROFILE, data);
        return response.data!;
    },

    async getAddresses(): Promise<Address[]> {
        const response = await apiClient.get<Address[]>(API_ENDPOINTS.ADDRESSES);
        return response.data!;
    },

    async createAddress(data: Omit<Address, 'id' | 'user_id' | 'created_at'>): Promise<Address> {
        const response = await apiClient.post<Address>(API_ENDPOINTS.ADDRESSES, data);
        return response.data!;
    },

    async updateAddress(id: number, data: Partial<Address>): Promise<Address> {
        const response = await apiClient.put<Address>(`${API_ENDPOINTS.ADDRESSES}/${id}`, data);
        return response.data!;
    },

    async deleteAddress(id: number): Promise<void> {
        await apiClient.delete(`${API_ENDPOINTS.ADDRESSES}/${id}`);
    },
};
