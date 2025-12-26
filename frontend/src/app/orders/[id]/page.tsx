'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/order.service';
import { reviewService } from '@/services/review.service';
import ReviewForm from '@/components/product/ReviewForm';
import OrderTimeline from '@/components/order/OrderTimeline';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle, FiMapPin, FiCreditCard } from 'react-icons/fi';

const statusConfig = {
    pending: { label: 'Chờ xác nhận', icon: FiClock, color: 'text-yellow-600 bg-yellow-50' },
    processing: { label: 'Đang xử lý', icon: FiPackage, color: 'text-blue-600 bg-blue-50' },
    shipping: { label: 'Đang giao', icon: FiTruck, color: 'text-purple-600 bg-purple-50' },
    delivered: { label: 'Đã giao', icon: FiCheckCircle, color: 'text-green-600 bg-green-50' },
    cancelled: { label: 'Đã hủy', icon: FiXCircle, color: 'text-red-600 bg-red-50' },
};

const paymentMethodLabels = {
    cod: 'Thanh toán khi nhận hàng',
    vnpay: 'VNPay',
    momo: 'MoMo',
};

const paymentStatusLabels = {
    pending: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền',
};

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = Number(params.id);

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [error, setError] = useState('');
    const [reviewingProductId, setReviewingProductId] = useState<number | null>(null);

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderById(orderId);
            setOrder(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy đơn');
            return;
        }

        try {
            setCancelling(true);
            await orderService.cancelOrder(orderId, { reason: cancelReason });
            setShowCancelModal(false);
            loadOrder(); // Reload order to get updated status
        } catch (err: any) {
            alert(err.response?.data?.error || 'Không thể hủy đơn hàng');
        } finally {
            setCancelling(false);
        }
    };

    const handleSubmitReview = async (data: any) => {
        try {
            await reviewService.createReview(data);
            alert('Đánh giá thành công!');
            setReviewingProductId(null);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Không thể gửi đánh giá');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <PrivateRoute>
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h1>
                    <button
                        onClick={() => router.push('/orders')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại danh sách đơn hàng
                    </button>
                </div>
            </PrivateRoute>
        );
    }

    const config = statusConfig[order.status as OrderStatus];
    const StatusIcon = config.icon;
    const canCancel = order.status === 'pending' || order.status === 'processing';

    return (
        <PrivateRoute>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/orders')}
                        className="text-blue-600 hover:text-blue-700 mb-4"
                    >
                        ← Quay lại
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                            <p className="text-gray-600 mt-1">Mã đơn: {order.order_code}</p>
                            <p className="text-sm text-gray-500">
                                Đặt ngày {new Date(order.created_at).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.color}`}>
                            <StatusIcon size={20} />
                            <span className="font-medium">{config.label}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiMapPin className="text-blue-600" />
                                Địa chỉ nhận hàng
                            </h2>
                            <div className="text-gray-700">
                                <p className="font-medium">{order.shipping_full_name}</p>
                                <p className="text-sm">{order.shipping_phone}</p>
                                <p className="text-sm mt-1">
                                    {order.shipping_detail_address}, {order.shipping_ward}, {order.shipping_district}, {order.shipping_province}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm đã đặt</h2>
                            <div className="divide-y">
                                {order.order_items?.map((item) => (
                                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                                {item.variant_name && (
                                                    <p className="text-sm text-gray-600">Size: {item.variant_name}</p>
                                                )}
                                                <p className="text-sm text-gray-600">Đơn giá: {item.price.toLocaleString()}đ</p>
                                                <p className="text-sm text-gray-600">Số lượng: x{item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900">{item.subtotal.toLocaleString()}đ</p>
                                            </div>
                                        </div>

                                        {/* Review button for delivered orders */}
                                        {order.status === 'delivered' && (
                                            <div className="mt-3">
                                                {reviewingProductId === item.product_id ? (
                                                    <ReviewForm
                                                        productId={item.product_id}
                                                        orderId={order.id}
                                                        onSubmit={handleSubmitReview}
                                                        onCancel={() => setReviewingProductId(null)}
                                                    />
                                                ) : (
                                                    <button
                                                        onClick={() => setReviewingProductId(item.product_id)}
                                                        className="text-sm text-blue-600 hover:text-blue-700"
                                                    >
                                                        Đánh giá sản phẩm
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Order Summary */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCreditCard className="text-blue-600" />
                                Thanh toán
                            </h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Phương thức:</span>
                                    <span className="font-medium">{paymentMethodLabels[order.payment_method]}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Trạng thái thanh toán:</span>
                                    <span className="font-medium">{paymentStatusLabels[order.payment_status]}</span>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="font-medium">{order.subtotal_amount.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="font-medium">{order.shipping_fee.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Tổng cộng:</span>
                                    <span className="text-blue-600">{order.total_amount.toLocaleString()}đ</span>
                                </div>
                            </div>

                            {order.note && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">Ghi chú:</p>
                                    <p className="text-gray-900">{order.note}</p>
                                </div>
                            )}

                            {order.cancel_reason && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">Lý do hủy:</p>
                                    <p className="text-gray-900">{order.cancel_reason}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {canCancel && (
                            <div className="text-right">
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Hủy đơn hàng
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Timeline */}
                    <div className="lg:col-span-1">
                        <OrderTimeline order={order} />
                    </div>
                </div>

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hủy đơn hàng</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng này
                            </p>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Nhập lý do hủy đơn..."
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={cancelling}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                                >
                                    {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PrivateRoute>
    );
}
