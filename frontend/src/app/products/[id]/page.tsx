'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/components/common/Loading';
import { productService } from '@/services/product.service';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import type { Product, ProductVariant } from '@/types';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                const id = Number(params.id);
                const data = await productService.getProductById(id);
                setProduct(data);
                
                // Select first variant by default
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariant(data.variants[0]);
                }
            } catch (err: any) {
                setError('Không thể tải thông tin sản phẩm');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!selectedVariant) {
            alert('Vui lòng chọn phân loại sản phẩm');
            return;
        }

        try {
            await addToCart({
                product_id: product!.id,
                variant_id: selectedVariant.id,
                quantity,
            });
            alert('Đã thêm vào giỏ hàng');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        }
    };

    if (isLoading) return <Loading />;

    if (error || !product) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center text-red-600">{error || 'Sản phẩm không tồn tại'}</div>
            </div>
        );
    }

    const images = product.images || [];
    const primaryImage = images.find((img) => img.is_primary) || images[0];
    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const displayPrice = hasDiscount ? product.discount_price : product.price;

    // Get unique sizes and colors
    const sizes = [...new Set(product.variants?.map((v) => v.size) || [])];
    const colors = [...new Set(product.variants?.map((v) => v.color) || [])];

    const handleSizeChange = (size: string) => {
        const variant = product.variants?.find(
            (v) => v.size === size && v.color === (selectedVariant?.color || colors[0])
        );
        if (variant) setSelectedVariant(variant);
    };

    const handleColorChange = (color: string) => {
        const variant = product.variants?.find(
            (v) => v.color === color && v.size === (selectedVariant?.size || sizes[0])
        );
        if (variant) setSelectedVariant(variant);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                    <div className="relative h-96 lg:h-[500px] w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                            src={getImageUrl(images[selectedImage]?.image_url || primaryImage?.image_url || '/placeholder.png')}
                            alt={product.name}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {images.map((img, index) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(index)}
                                    className={`relative h-20 border-2 rounded-md overflow-hidden ${
                                        selectedImage === index ? 'border-blue-600' : 'border-gray-300'
                                    }`}
                                >
                                    <Image
                                        src={getImageUrl(img.image_url)}
                                        alt={`${product.name} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    
                    <div className="flex items-center space-x-4 mb-6">
                        {hasDiscount ? (
                            <>
                                <span className="text-3xl font-bold text-red-600">
                                    {formatCurrency(product.discount_price!)}
                                </span>
                                <span className="text-xl text-gray-500 line-through">
                                    {formatCurrency(product.price)}
                                </span>
                                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                                    -{Math.round(((product.price - product.discount_price!) / product.price) * 100)}%
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">
                                {formatCurrency(product.price)}
                            </span>
                        )}
                    </div>

                    <div className="prose max-w-none mb-6">
                        <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* Size Selection */}
                    {sizes.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kích thước
                            </label>
                            <div className="flex gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeChange(size)}
                                        className={`px-4 py-2 border rounded-md ${
                                            selectedVariant?.size === size
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Selection */}
                    {colors.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Màu sắc
                            </label>
                            <div className="flex gap-2">
                                {colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => handleColorChange(color)}
                                        className={`px-4 py-2 border rounded-md ${
                                            selectedVariant?.color === color
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stock */}
                    {selectedVariant && (
                        <div className="mb-4">
                            <span className="text-sm text-gray-600">
                                Còn lại: <span className="font-semibold">{selectedVariant.stock_quantity}</span> sản phẩm
                            </span>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số lượng
                        </label>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="text-lg font-semibold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || 99, quantity + 1))}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock_quantity === 0}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {selectedVariant?.stock_quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                    </button>
                </div>
            </div>
        </div>
    );
}
