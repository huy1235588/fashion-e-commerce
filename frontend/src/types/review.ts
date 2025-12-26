// Review Types
export interface Review {
    id: number;
    product_id: number;
    user_id: number;
    rating: number;
    comment: string;
    images?: string[];
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    user?: {
        id: number;
        full_name: string;
    };
}

export interface ProductRating {
    average_rating: number;
    review_count: number;
}

export interface CreateReviewRequest {
    product_id: number;
    order_id: number;
    rating: number;
    comment?: string;
    images?: string[];
}

export interface ReviewsResponse {
    data: Review[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}
