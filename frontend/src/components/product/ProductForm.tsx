'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant, Category } from '@/types';
import { productService } from '@/services/product.service';
import ImageUpload from '@/components/common/ImageUpload';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import { toast } from '@/components/common/Toast';
import { FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi';

interface ProductFormProps {
    product?: Product;
    mode: 'create' | 'edit';
}

interface ProductFormData {
    name: string;
    description: string;
    category_id: string;
    price: string;
    discount_price: string;
    is_active: boolean;
}

interface VariantFormData {
    size: string;
    color: string;
    stock_quantity: string;
    sku: string;
}

export default function ProductForm({ product, mode }: ProductFormProps) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState<ProductFormData>({
        name: product?.name || '',
        description: product?.description || '',
        category_id: product?.category_id?.toString() || '',
        price: product?.price?.toString() || '',
        discount_price: product?.discount_price?.toString() || '',
        is_active: product?.is_active ?? true,
    });

    const [images, setImages] = useState<string[]>(
        product?.images?.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
            .map(img => img.image_url) || []
    );

    const [variants, setVariants] = useState<VariantFormData[]>(
        product?.variants?.map(v => ({
            size: v.size,
            color: v.color,
            stock_quantity: v.stock_quantity.toString(),
            sku: v.sku,
        })) || [
            { size: 'M', color: 'Đen', stock_quantity: '10', sku: '' }
        ]
    );

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (err: any) {
            setError('Không thể tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleAddVariant = () => {
        setVariants([...variants, { size: 'M', color: 'Đen', stock_quantity: '10', sku: '' }]);
    };

    const handleRemoveVariant = (index: number) => {
        if (variants.length === 1) {
            toast.error('Sản phẩm phải có ít nhất 1 biến thể');
            return;
        }
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleVariantChange = (index: number, field: keyof VariantFormData, value: string) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên sản phẩm');
            return false;
        }
        if (!formData.category_id) {
            toast.error('Vui lòng chọn danh mục');
            return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error('Vui lòng nhập giá hợp lệ');
            return false;
        }
        if (formData.discount_price && parseFloat(formData.discount_price) >= parseFloat(formData.price)) {
            toast.error('Giá khuyến mãi phải nhỏ hơn giá gốc');
            return false;
        }
        if (images.length === 0) {
            toast.error('Vui lòng tải lên ít nhất 1 ảnh sản phẩm');
            return false;
        }
        if (variants.length === 0) {
            toast.error('Sản phẩm phải có ít nhất 1 biến thể');
            return false;
        }
        for (let i = 0; i < variants.length; i++) {
            const v = variants[i];
            if (!v.size.trim() || !v.color.trim()) {
                toast.error(`Biến thể ${i + 1}: Vui lòng nhập đầy đủ kích thước và màu sắc`);
                return false;
            }
            if (!v.stock_quantity || parseInt(v.stock_quantity) < 0) {
                toast.error(`Biến thể ${i + 1}: Số lượng tồn kho không hợp lệ`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setSubmitting(true);
        setError('');

        try {
            // TODO: Implement actual API call when backend is ready
            // For now, just show success message
            toast.info('Tính năng đang phát triển - API chưa sẵn sàng');
            console.log('Form data:', {
                ...formData,
                price: parseFloat(formData.price),
                discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
                category_id: parseInt(formData.category_id),
                images,
                variants: variants.map(v => ({
                    ...v,
                    stock_quantity: parseInt(v.stock_quantity),
                })),
            });
            
            // router.push('/admin/products');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra');
            toast.error('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <ErrorMessage message={error} />

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
                
                <div className="space-y-4">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên sản phẩm <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ví dụ: Áo thun nam basic"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả sản phẩm
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập mô tả chi tiết về sản phẩm..."
                        />
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá gốc (VNĐ) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min="0"
                                step="1000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="299000"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá khuyến mãi (VNĐ)
                            </label>
                            <input
                                type="number"
                                name="discount_price"
                                value={formData.discount_price}
                                onChange={handleInputChange}
                                min="0"
                                step="1000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="249000"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">
                            Kích hoạt sản phẩm (hiển thị trên trang chủ)
                        </label>
                    </div>
                </div>
            </div>

            {/* Product Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                </h2>
                <ImageUpload images={images} onImagesChange={setImages} maxImages={8} />
            </div>

            {/* Product Variants */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Biến thể sản phẩm <span className="text-red-500">*</span>
                    </h2>
                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <FiPlus className="w-4 h-4" />
                        Thêm biến thể
                    </button>
                </div>

                <div className="space-y-4">
                    {variants.map((variant, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-gray-900">Biến thể #{index + 1}</h3>
                                {variants.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveVariant(index)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                        title="Xóa biến thể"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kích thước
                                    </label>
                                    <select
                                        value={variant.size}
                                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                        <option value="XXXL">XXXL</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Màu sắc
                                    </label>
                                    <input
                                        type="text"
                                        value={variant.color}
                                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Đen"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số lượng
                                    </label>
                                    <input
                                        type="number"
                                        value={variant.stock_quantity}
                                        onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)}
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        SKU (tùy chọn)
                                    </label>
                                    <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="SKU-001"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={submitting}
                >
                    <FiX className="w-4 h-4" />
                    Hủy
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting}
                >
                    <FiSave className="w-4 h-4" />
                    {submitting ? 'Đang lưu...' : mode === 'create' ? 'Tạo sản phẩm' : 'Cập nhật'}
                </button>
            </div>
        </form>
    );
}
