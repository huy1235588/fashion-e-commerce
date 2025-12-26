'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';

function PaymentSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('order_code');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/orders');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="text-green-600" size={48} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Đặt hàng thành công!
                </h1>

                {orderCode && (
                    <p className="text-gray-600 mb-6">
                        Mã đơn hàng: <span className="font-semibold">{orderCode}</span>
                    </p>
                )}

                <p className="text-gray-700 mb-6">
                    Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/orders"
                        className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FiPackage className="inline mr-2" />
                        Xem đơn hàng của tôi
                    </Link>

                    <Link
                        href="/products"
                        className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    Tự động chuyển đến trang đơn hàng sau {countdown} giây...
                </p>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
