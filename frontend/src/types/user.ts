// User Types
export interface User {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    role: 'customer' | 'admin';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
