export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
export const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:8080/uploads';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // User
    PROFILE: '/users/profile',
    ADDRESSES: '/users/addresses',

    // Products
    PRODUCTS: '/products',
    PRODUCT_DETAIL: (id: number) => `/products/${id}`,

    // Categories
    CATEGORIES: '/categories',
    CATEGORY_DETAIL: (id: number) => `/categories/${id}`,

    // Cart
    CART: '/cart',
    CART_ITEMS: '/cart/items',
    CART_ITEM: (id: number) => `/cart/items/${id}`,
    CLEAR_CART: '/cart/clear',

    // Orders
    ORDERS: '/orders',
    ORDER_DETAIL: (id: number) => `/orders/${id}`,
    CANCEL_ORDER: (id: number) => `/orders/${id}/cancel`,

    // Reviews
    PRODUCT_REVIEWS: (productId: number) => `/products/${productId}/reviews`,
    REVIEWS: '/reviews',
    REVIEW_DETAIL: (id: number) => `/reviews/${id}`,

    // Payments
    VNPAY_CREATE: '/payments/vnpay/create',
    MOMO_CREATE: '/payments/momo/create',

    // Admin
    ADMIN_CATEGORIES: '/admin/categories',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_STATS: '/admin/stats/dashboard',
} as const;

export const ITEMS_PER_PAGE = 12;

export const ORDER_STATUS_LABELS: Record<string, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    cod: 'Thanh toán khi nhận hàng',
    vnpay: 'VNPay',
    momo: 'MoMo',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
    pending: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
};
