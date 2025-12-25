import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Fashion Store</h3>
                        <p className="text-gray-400">
                            Website thương mại điện tử bán hàng thời trang
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Liên kết</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-white">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Thông tin</h3>
                        <p className="text-gray-400">Email: support@fashionstore.com</p>
                        <p className="text-gray-400">Phone: 0123 456 789</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Fashion Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
