'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { productService } from '@/services/product.service';
import { Product, Category } from '@/types';
import Loading from '@/components/common/Loading';
import { FiShoppingBag, FiTruck, FiRefreshCw, FiShield, FiStar } from 'react-icons/fi';

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productService.getProducts({ page: 1, limit: 8 }),
                productService.getCategories(),
            ]);
            setFeaturedProducts(productsRes.data);
            setCategories(categoriesRes.slice(0, 6));
        } catch (error) {
            console.error('Failed to load homepage data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section 
                className="relative text-white overflow-hidden"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '660px',
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
                
                <div className="relative container flex items-center min-h-150 mx-auto px-4 py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Thời Trang Đẳng Cấp
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-gray-100">
                            Khám phá bộ sưu tập mới nhất với phong cách độc đáo và chất lượng cao
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="/products"
                                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                            >
                                Mua sắm ngay
                            </Link>
                            <Link
                                href="/products"
                                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all"
                            >
                                Khám phá
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="container mx-auto px-4 py-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
                        Danh Mục Sản Phẩm
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?category=${category.id}`}
                                className="group bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FiShoppingBag className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Sản Phẩm Nổi Bật
                            </h2>
                            <Link
                                href="/products"
                                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
                            >
                                Xem tất cả
                                <span>→</span>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
                                >
                                    <div className="aspect-square bg-gray-200 overflow-hidden">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0].image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FiShoppingBag className="w-20 h-20 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center text-yellow-500">
                                                <FiStar className="fill-current w-4 h-4" />
                                                <span className="text-sm text-gray-600 ml-1">4.5</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {product.discount_price ? (
                                                <>
                                                    <span className="text-lg font-bold text-blue-600">
                                                        {product.discount_price.toLocaleString('vi-VN')}₫
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        {product.price.toLocaleString('vi-VN')}₫
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold text-gray-900">
                                                    {product.price.toLocaleString('vi-VN')}₫
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
                    Tại Sao Chọn Chúng Tôi?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiTruck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Giao Hàng Nhanh</h3>
                        <p className="text-gray-600">Giao hàng toàn quốc trong 2-3 ngày</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <FiRefreshCw className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Đổi Trả Dễ Dàng</h3>
                        <p className="text-gray-600">Đổi trả miễn phí trong 7 ngày</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all">
                        <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                            <FiShield className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanh Toán An Toàn</h3>
                        <p className="text-gray-600">Nhiều phương thức thanh toán tiện lợi</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition-all">
                        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                            <FiStar className="w-8 h-8 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chất Lượng Cao</h3>
                        <p className="text-gray-600">Cam kết sản phẩm chính hãng 100%</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-700 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Đăng Ký Nhận Ưu Đãi
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt
                    </p>
                    <div className="max-w-md mx-auto flex gap-2">
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="flex-1 px-6 py-3 rounded-lg text-white focus:outline-neutral-300 bg-blue-600 border border-blue-200"
                        />
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                            Đăng ký
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
