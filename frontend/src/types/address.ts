export interface Address {
    id: number;
    user_id: number;
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail_address: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateAddressRequest {
    full_name: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail_address: string;
    is_default?: boolean;
}

export interface UpdateAddressRequest {
    full_name?: string;
    phone?: string;
    province?: string;
    district?: string;
    ward?: string;
    detail_address?: string;
    is_default?: boolean;
}
