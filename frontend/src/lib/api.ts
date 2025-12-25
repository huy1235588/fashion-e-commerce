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
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    public setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    public clearToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    public async get<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.get<ApiResponse<T>>(url, config);
        return response.data;
    }

    public async post<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.post<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    public async put<T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.put<ApiResponse<T>>(url, data, config);
        return response.data;
    }

    public async delete<T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response = await this.instance.delete<ApiResponse<T>>(url, config);
        return response.data;
    }
}

export const apiClient = new ApiClient();
