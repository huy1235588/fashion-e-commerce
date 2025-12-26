import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from './constants';
import type { ApiResponse } from '@/types';

class ApiClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                // Add auth token if exists
                const token = this.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response: AxiosResponse<ApiResponse>) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    // Unauthorized - clear token and redirect to login
                    this.clearToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private getToken(): string | null {
        if (typeof window !== 'undefined') {
            // Get token from Zustand store (persisted in localStorage)
            const storage = localStorage.getItem('auth-storage');
            if (storage) {
                try {
                    const parsed = JSON.parse(storage);
                    return parsed.state?.token || null;
                } catch {
                    return null;
                }
            }
        }
        return null;
    }

    public setToken(token: string): void {
        // Token is managed by Zustand auth store
        // This method is kept for compatibility
    }

    public clearToken(): void {
        // Token clearing is managed by Zustand auth store
        // This method is kept for compatibility
    }

    public async get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.instance.get<T>(url, config);
        return response.data;
    }

    public async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.instance.post<T>(url, data, config);
        return response.data;
    }

    public async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.instance.put<T>(url, data, config);
        return response.data;
    }

    public async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.instance.delete<T>(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();
export default apiClient;
