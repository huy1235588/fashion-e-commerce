'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
    FiFacebook, 
    FiInstagram, 
    FiYoutube, 
    FiMail,
    FiPhone,
    FiMapPin,
    FiSend,
    FiCheck,
    FiShield,
    FiTruck,
    FiRefreshCw
} from 'react-icons/fi';
import { Button, Input } from '@/components/ui';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // Mock subscription
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail('');
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            {/* Trust badges section */}
            <div className="border-b border-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiTruck className="w-6 h-6 text-primary-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Giao hàng miễn phí</h4>
                                <p className="text-sm text-gray-400">Đơn hàng từ 500.000₫</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-success-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiRefreshCw className="w-6 h-6 text-success-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Đổi trả dễ dàng</h4>
                                <p className="text-sm text-gray-400">Trong vòng 7 ngày</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-warning-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FiShield className="w-6 h-6 text-warning-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Thanh toán an toàn</h4>
                                <p className="text-sm text-gray-400">Bảo mật 100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Column 1: Brand & Social */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-white mb-4">
                            <span className="bg-primary-600 text-white px-2 py-1 rounded-lg text-sm">
                                F
                            </span>
                            Fashion Store
                        </Link>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Cửa hàng thời trang hàng đầu với các sản phẩm chất lượng cao, 
                            phong cách hiện đại và giá cả hợp lý.
                        </p>
                        
                        {/* Social links */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                                aria-label="Facebook"
                            >
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 rounded-lg flex items-center justify-center transition-all"
                                aria-label="Instagram"
                            >
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                                aria-label="YouTube"
                            >
                                <FiYoutube className="w-5 h-5" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-800 hover:bg-black rounded-lg flex items-center justify-center transition-colors border border-gray-700 hover:border-gray-600"
                                aria-label="TikTok"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Mua sắm</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Tất cả sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?sort=newest" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Hàng mới về
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?sale=true" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Khuyến mãi
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=1" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Áo
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=2" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Quần
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Chính sách vận chuyển
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Đăng ký nhận tin</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Nhận thông tin khuyến mãi và sản phẩm mới nhất
                        </p>
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email của bạn"
                                    className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                                >
                                    {isSubscribed ? <FiCheck className="w-5 h-5" /> : <FiSend className="w-5 h-5" />}
                                </button>
                            </div>
                            {isSubscribed && (
                                <p className="text-success-400 text-sm">Đăng ký thành công!</p>
                            )}
                        </form>

                        {/* Contact info */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <FiPhone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-400">0123 456 789</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <FiMail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-400">support@fashionstore.com</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <FiMapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <span className="text-gray-400">123 Đường ABC, Quận 1, TP.HCM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment methods & Copyright */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Payment methods */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">Thanh toán:</span>
                            <div className="flex items-center gap-2">
                                {/* Visa */}
                                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                    <svg viewBox="0 0 48 48" className="h-4">
                                        <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
                                        <path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.674 1.991.674l.466-2.309c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.231.964-1.888.964-1.662 0-2.759-.609-2.759-.609l-.495 2.216c0 0 1.063.606 3.117.606 2.059 0 4.915-1.54 4.915-3.752C30.354 23.586 26.369 23.394 26.369 22.206z"/>
                                    </svg>
                                </div>
                                {/* Mastercard */}
                                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                                    <svg viewBox="0 0 48 48" className="h-4">
                                        <path fill="#3F51B5" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z"/>
                                        <path fill="#FFC107" d="M30 24A6 6 0 1 0 30 36 6 6 0 1 0 30 24z"/>
                                        <path fill="#FF3D00" d="M18 24A6 6 0 1 0 18 36 6 6 0 1 0 18 24z"/>
                                        <path fill="#FF9800" d="M24,27.166c-0.963-0.875-1.571-2.134-1.571-3.541c0-1.407,0.608-2.666,1.571-3.541c0.963,0.875,1.571,2.134,1.571,3.541C25.571,25.032,24.963,26.291,24,27.166z"/>
                                    </svg>
                                </div>
                                {/* VNPay */}
                                <div className="px-2 h-6 bg-blue-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">VNPay</span>
                                </div>
                                {/* MoMo */}
                                <div className="px-2 h-6 bg-pink-500 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">MoMo</span>
                                </div>
                                {/* COD */}
                                <div className="px-2 h-6 bg-gray-600 rounded flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">COD</span>
                                </div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <p className="text-sm text-gray-500">
                            © {currentYear} Fashion Store. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
