'use client';

import { useState } from 'react';
import { CreateReviewRequest } from '@/types/review';

interface ReviewFormProps {
    productId: number;
    orderId: number;
    onSubmit: (data: CreateReviewRequest) => Promise<void>;
    onCancel?: () => void;
}

export default function ReviewForm({ productId, orderId, onSubmit, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({
                product_id: productId,
                order_id: orderId,
                rating,
                comment: comment.trim() || undefined,
            });
            setRating(5);
            setComment('');
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá sản phẩm</h3>

            {/* Rating */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá của bạn
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none"
                        >
                            <svg
                                className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét (không bắt buộc)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                )}
            </div>
        </form>
    );
}
