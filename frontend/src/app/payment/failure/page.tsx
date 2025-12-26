'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiXCircle, FiHome } from 'react-icons/fi';

function PaymentFailureContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderCode = searchParams.get('order_code');
    const error = searchParams.get('error');
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push('/');
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
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiXCircle className="text-red-600" size={48} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Thanh toán thất bại
                </h1>

                {orderCode && (
                    <p className="text-gray-600 mb-4">
                        Mã đơn hàng: <span className="font-semibold">{orderCode}</span>
                    </p>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <p className="text-gray-700 mb-6">
                    Giao dịch thanh toán của bạn không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
                </p>

                <div className="space-y-3">
                    {orderCode && (
                        <Link
                            href="/checkout"
                            className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thử lại
                        </Link>
                    )}

                    <Link
                        href="/"
                        className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FiHome className="inline mr-2" />
                        Về trang chủ
                    </Link>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                    Tự động chuyển về trang chủ sau {countdown} giây...
                </p>
            </div>
        </div>
    );
}

export default function PaymentFailurePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        }>
            <PaymentFailureContent />
        </Suspense>
    );
}
