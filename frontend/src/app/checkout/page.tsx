'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Address, PaymentMethod, CreateOrderRequest, CartItem } from '@/types';
import { addressService } from '@/services/address.service';
import { orderService } from '@/services/order.service';
import { paymentService } from '@/services/payment.service';
import { useCart } from '@/hooks/useCart';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { FiMapPin, FiCreditCard, FiFileText } from 'react-icons/fi';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, totalItems, isLoading: cartLoading } = useCart();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);

            // Auto-select default address
            const defaultAddress = data.find(addr => addr.is_default);
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            } else if (data.length > 0) {
                setSelectedAddressId(data[0].id);
            }
        } catch (err) {
            console.error('Failed to load addresses:', err);
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            setError('Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        if (!paymentMethod) {
            setError('Vui lòng chọn phương thức thanh toán');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const orderData: CreateOrderRequest = {
                address_id: selectedAddressId,
                payment_method: paymentMethod,
                note: note || undefined,
            };

            const order = await orderService.createOrder(orderData);

            // Handle payment based on method
            if (paymentMethod === 'vnpay' || paymentMethod === 'momo') {
                // Initiate online payment
                try {
                    const paymentResponse = await paymentService.initiatePayment({
                        order_id: order.id,
                    });

                    if (paymentResponse.payment_url) {
                        // Redirect to payment gateway
                        window.location.href = paymentResponse.payment_url;
                        return;
                    }
                } catch (paymentErr: any) {
                    console.error('Payment initiation error:', paymentErr);
                    // Continue to order page even if payment fails
                }
            }

            // For COD or if payment initiation fails, redirect to order page
            router.push(`/orders/${order.id}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Không thể tạo đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    if (cartLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (totalItems === 0) {
        return (
            <PrivateRoute>
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
                    <p className="text-gray-600 mb-6">Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
                    <Link
                        href="/products"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </PrivateRoute>
        );
    }

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    return (
        <PrivateRoute>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Thanh toán</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FiMapPin className="text-blue-600" />
                                    Địa chỉ giao hàng
                                </h2>
                                <Link href="/addresses" className="text-sm text-blue-600 hover:text-blue-700">
                                    Quản lý địa chỉ
                                </Link>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ giao hàng</p>
                                    <Link
                                        href="/addresses"
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Thêm địa chỉ mới
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((address) => (
                                        <label
                                            key={address.id}
                                            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedAddressId === address.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                value={address.id}
                                                checked={selectedAddressId === address.id}
                                                onChange={() => setSelectedAddressId(address.id)}
                                                className="mr-3"
                                            />
                                            <div className="inline-block">
                                                <div className="font-medium text-gray-900">
                                                    {address.full_name} - {address.phone}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {address.detail_address}, {address.ward}, {address.district}, {address.province}
                                                </div>
                                                {address.is_default && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiCreditCard className="text-blue-600" />
                                Phương thức thanh toán
                            </h2>

                            <div className="space-y-3">
                                <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                                </label>

                                <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'vnpay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="vnpay"
                                        checked={paymentMethod === 'vnpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">VNPay</span>
                                    <span className="text-sm text-gray-500 ml-2">(Đang phát triển)</span>
                                </label>

                                <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'momo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="momo"
                                        checked={paymentMethod === 'momo'}
                                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                                        className="mr-3"
                                    />
                                    <span className="font-medium">MoMo</span>
                                    <span className="text-sm text-gray-500 ml-2">(Đang phát triển)</span>
                                </label>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FiFileText className="text-blue-600" />
                                Ghi chú đơn hàng
                            </h2>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Ghi chú cho người bán..."
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h2>

                            <div className="space-y-4 mb-4">
                                {cart?.items?.map((item: CartItem) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{item.product?.name}</p>
                                            {item.variant && (
                                                <p className="text-xs text-gray-500">Size: {item.variant.size}</p>
                                            )}
                                            <p className="text-sm text-gray-600">x{item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {(item.price * item.quantity).toLocaleString()}đ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tạm tính:</span>
                                    <span className="font-medium">{cart?.subtotal.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Phí vận chuyển:</span>
                                    <span className="font-medium">30,000đ</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Tổng cộng:</span>
                                    <span className="text-blue-600">{((cart?.subtotal || 0) + 30000).toLocaleString()}đ</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading || !selectedAddressId || addresses.length === 0}
                                className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PrivateRoute>
    );
}
