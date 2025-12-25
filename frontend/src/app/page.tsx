import Link from 'next/link';

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 mb-12">
                <div className="max-w-3xl">
                    <h1 className="text-5xl font-bold mb-4">Chào mừng đến Fashion Store</h1>
                    <p className="text-xl mb-6">
                        Khám phá bộ sưu tập thời trang mới nhất với phong cách độc đáo
                    </p>
                    <Link
                        href="/products"
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        Mua sắm ngay
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Danh mục nổi bật</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Áo', 'Quần', 'Phụ kiện'].map((category) => (
                        <div
                            key={category}
                            className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition cursor-pointer"
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Tại sao chọn chúng tôi?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Giao hàng nhanh</h3>
                        <p className="text-gray-600">Giao hàng toàn quốc trong 2-3 ngày</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Đổi trả dễ dàng</h3>
                        <p className="text-gray-600">Đổi trả miễn phí trong 7 ngày</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thanh toán an toàn</h3>
                        <p className="text-gray-600">Nhiều phương thức thanh toán tiện lợi</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
