'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PrivateRoute from '@/components/auth/PrivateRoute';
import { categoryService } from '@/services/category.service';
import { Category } from '@/types';
import Loading from '@/components/common/Loading';
import ErrorMessage from '@/components/common/ErrorMessage';
import { toast } from '@/components/common/Toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = Number(params.id);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [category, setCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });

    useEffect(() => {
        loadCategory();
    }, [categoryId]);

    const loadCategory = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await categoryService.getCategoryById(categoryId);
            setCategory(data);
            setFormData({
                name: data.name,
                slug: data.slug,
                description: data.description || '',
            });
        } catch (err: any) {
            setError('Không thể tải thông tin danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập tên danh mục');
            return;
        }

        if (!formData.slug.trim()) {
            toast.error('Vui lòng nhập slug');
            return;
        }

        try {
            setSubmitting(true);
            await categoryService.updateCategory(categoryId, {
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || undefined,
            });
            toast.success('Cập nhật danh mục thành công');
            router.push('/admin/categories');
        } catch (err: any) {
            toast.error(err.message || 'Không thể cập nhật danh mục');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;
    if (!category) return <ErrorMessage message="Không tìm thấy danh mục" />;

    return (
        <PrivateRoute>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa danh mục</h1>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ID Info */}
                        <div className="pb-4 border-b">
                            <p className="text-sm text-gray-500">ID: {category.id}</p>
                            <p className="text-sm text-gray-500">
                                Ngày tạo: {new Date(category.created_at).toLocaleString('vi-VN')}
                            </p>
                            <p className="text-sm text-gray-500">
                                Cập nhật: {new Date(category.updated_at).toLocaleString('vi-VN')}
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên danh mục <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập tên danh mục"
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="slug-danh-muc"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                URL-friendly identifier cho danh mục này.
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nhập mô tả danh mục (tùy chọn)"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSave className="w-4 h-4" />
                                <span>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PrivateRoute>
    );
}
