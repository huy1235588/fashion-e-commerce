'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { toast } from '@/components/common/Toast';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.forgotPassword(email);
            setIsSuccess(true);
            toast.success('Mã xác thực đã được gửi đến email của bạn');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Gửi mã xác thực thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="mb-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kiểm tra email của bạn</h2>
                        <p className="text-gray-600 mb-6">
                            Chúng tôi đã gửi mã xác thực đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư của bạn.
                        </p>
                        <Link
                            href="/reset-password"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold"
                        >
                            Đặt lại mật khẩu
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Quên mật khẩu</h1>
                <p className="text-gray-600 text-center mb-6">
                    Nhập email của bạn để nhận mã xác thực
                </p>

                <ErrorMessage message={error} className="mb-4" />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="example@email.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400"
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}
