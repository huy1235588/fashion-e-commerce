'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/order.service';
import { Order, OrderStatus } from '@/types';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from '@/components/common/Toast';
import { FiPackage, FiMapPin, FiCreditCard, FiFileText, FiArrowLeft } from 'react-icons/fi';

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy',
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipping: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
    pending: 'processing',
    processing: 'shipping',
    shipping: 'delivered',
    delivered: null,
    cancelled: null,
};

export default function AdminOrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuthStore();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus | null>(null);

    const orderId = params?.id ? parseInt(params.id as string) : null;

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }

        if (orderId) {
            loadOrder();
        } else {
            setError('ID đơn hàng không hợp lệ');
            setLoading(false);
        }
    }, [user, router, orderId]);

    const loadOrder = async () => {
        if (!orderId) return;

        try {
            setLoading(true);
            setError('');
            const data = await orderService.getOrderById(orderId);
            setOrder(data);
        } catch (err: any) {
            setError('Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!orderId || !newStatus) return;

        setUpdating(true);
        try {
            await orderService.updateOrderStatus(orderId, { status: newStatus });
            toast.success('Đã cập nhật trạng thái đơn hàng');
            await loadOrder();
        } catch (err: any) {
            toast.error('Không thể cập nhật trạng thái');
        } finally {
            setUpdating(false);
            setShowUpdateDialog(false);
            setNewStatus(null);
        }
    };

    const confirmStatusUpdate = (status: OrderStatus) => {
        setNewStatus(status);
        setShowUpdateDialog(true);
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    if (loading) {
        return <Loading />;
    }

    if (error || !order) {
        return (
            <PrivateRoute>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-5xl mx-auto px-4 py-8">
                        <ErrorMessage message={error || 'Không tìm thấy đơn hàng'} />
                        <button
                            onClick={() => router.push('/admin/orders')}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            ← Quay lại danh sách
                        </button>
                    </div>
                </div>
            </PrivateRoute>
        );
    }

    const nextStatus = NEXT_STATUS[order.status];

    return (
        <PrivateRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <button
                            onClick={() => router.push('/admin/orders')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Quay lại danh sách
                        </button>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h1>
                                <p className="text-gray-600 mt-1">Mã đơn: {order.order_code}</p>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                ORDER_STATUS_COLORS[order.status]
                            }`}>
                                {ORDER_STATUS_LABELS[order.status]}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FiPackage className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Sản phẩm</h2>
                                </div>
                                <div className="space-y-4">
                                    {order.order_items?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                                                {item.variant_name && (
                                                    <p className="text-sm text-gray-600 mt-1">{item.variant_name}</p>
                                                )}
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Số lượng: {item.quantity} × {item.price.toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900">
                                                    {item.subtotal.toLocaleString('vi-VN')}₫
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tạm tính:</span>
                                        <span className="text-gray-900">{order.subtotal_amount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Phí vận chuyển:</span>
                                        <span className="text-gray-900">{order.shipping_fee.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span className="text-gray-900">Tổng cộng:</span>
                                        <span className="text-blue-600">{order.total_amount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FiMapPin className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-gray-900 font-medium">{order.shipping_full_name}</p>
                                    <p className="text-gray-600">{order.shipping_phone}</p>
                                    <p className="text-gray-600">
                                        {order.shipping_detail_address}, {order.shipping_ward}, {order.shipping_district}, {order.shipping_province}
                                    </p>
                                </div>
                            </div>

                            {/* Notes */}
                            {(order.note || order.cancel_reason) && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiFileText className="w-5 h-5 text-gray-600" />
                                        <h2 className="text-xl font-semibold text-gray-900">Ghi chú</h2>
                                    </div>
                                    {order.note && (
                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-700">Ghi chú của khách:</p>
                                            <p className="text-gray-600 mt-1">{order.note}</p>
                                        </div>
                                    )}
                                    {order.cancel_reason && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Lý do hủy:</p>
                                            <p className="text-red-600 mt-1">{order.cancel_reason}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Payment Info */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <FiCreditCard className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Thanh toán</h2>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Phương thức:</p>
                                        <p className="text-gray-900 font-medium mt-1">
                                            {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' :
                                             order.payment_method === 'vnpay' ? 'VNPay' :
                                             order.payment_method === 'momo' ? 'MoMo' : order.payment_method}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Trạng thái:</p>
                                        <p className={`font-medium mt-1 ${
                                            order.payment_status === 'paid' ? 'text-green-600' :
                                            order.payment_status === 'pending' ? 'text-yellow-600' :
                                            order.payment_status === 'failed' ? 'text-red-600' :
                                            'text-gray-600'
                                        }`}>
                                            {order.payment_status === 'paid' ? 'Đã thanh toán' :
                                             order.payment_status === 'pending' ? 'Chưa thanh toán' :
                                             order.payment_status === 'failed' ? 'Thất bại' :
                                             order.payment_status === 'refunded' ? 'Đã hoàn tiền' : order.payment_status}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Info */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-600">Ngày đặt:</p>
                                        <p className="text-gray-900 mt-1">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Cập nhật:</p>
                                        <p className="text-gray-900 mt-1">{new Date(order.updated_at).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Update */}
                            {nextStatus && (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Cập nhật trạng thái</h2>
                                    <button
                                        onClick={() => confirmStatusUpdate(nextStatus)}
                                        disabled={updating}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {updating ? 'Đang cập nhật...' : `Chuyển sang: ${ORDER_STATUS_LABELS[nextStatus]}`}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showUpdateDialog}
                title="Xác nhận cập nhật trạng thái"
                message={`Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái "${newStatus ? ORDER_STATUS_LABELS[newStatus] : ''}"?`}
                confirmText="Xác nhận"
                cancelText="Hủy"
                variant="info"
                onConfirm={handleUpdateStatus}
                onCancel={() => {
                    setShowUpdateDialog(false);
                    setNewStatus(null);
                }}
            />
        </PrivateRoute>
    );
}
