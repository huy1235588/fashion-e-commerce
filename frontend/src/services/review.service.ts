import api from '@/lib/api';
import { Review, ReviewsResponse, CreateReviewRequest, ProductRating } from '@/types/review';

export const reviewService = {
  // Create a review
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await api.post<{ data: Review }>('/reviews', data);
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId: number, page: number = 1, limit: number = 10): Promise<ReviewsResponse> => {
    const response = await api.get<ReviewsResponse>(`/products/${productId}/reviews`, {
      params: { page, limit }
    });
    return response;
  },

  // Get product rating
  getProductRating: async (productId: number): Promise<ProductRating> => {
    const response = await api.get<{ data: ProductRating }>(`/products/${productId}/rating`);
    return response.data;
  },

  // Get user reviews
  getUserReviews: async (): Promise<Review[]> => {
    const response = await api.get<{ data: Review[] }>('/users/me/reviews');
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  }
};
