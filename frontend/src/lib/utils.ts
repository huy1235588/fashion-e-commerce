import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { API_BASE_URL, UPLOAD_BASE_URL } from './constants';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Get full image URL from relative path or external URL
 * @param path - Image path (relative or absolute)
 * @returns Full image URL
 */
export function getImageUrl(path: string | undefined | null): string {
    if (!path) return '/placeholder-image.jpg'; // Default placeholder
    
    // If already a full URL (http/https) or blob URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
        return path;
    }
    
    // If path starts with /uploads, use UPLOAD_BASE_URL
    if (path.startsWith('/uploads')) {
        const baseUrl = API_BASE_URL.replace('/api/v1', '');
        return `${baseUrl}${path}`;
    }
    
    // Otherwise, assume it's a relative path under /uploads
    return `${UPLOAD_BASE_URL}/${path.replace(/^\/+/, '')}`;
}
