'use client';

import { useState, useEffect } from 'react';
import { Address, CreateAddressRequest } from '@/types';
import { FiX } from 'react-icons/fi';

interface AddressFormProps {
    address?: Address;
    onSubmit: (data: CreateAddressRequest) => Promise<void>;
    onCancel: () => void;
}

export default function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState<CreateAddressRequest>({
        full_name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        detail_address: '',
        is_default: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (address) {
            setFormData({
                full_name: address.full_name,
                phone: address.phone,
                province: address.province,
                district: address.district,
                ward: address.ward,
                detail_address: address.detail_address,
                is_default: address.is_default,
            });
        }
    }, [address]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.full_name || !formData.phone || !formData.province ||
            !formData.district || !formData.ward || !formData.detail_address) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Phone validation
        const phoneRegex = /^(0|\+84)[0-9]{9}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            setError('Số điện thoại không hợp lệ');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                                Tỉnh/Thành phố <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="province"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                placeholder="Hà Nội"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                                Quận/Huyện <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder="Cầu Giấy"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                                Phường/Xã <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="ward"
                                name="ward"
                                value={formData.ward}
                                onChange={handleChange}
                                placeholder="Dịch Vọng"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="detail_address" className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ cụ thể <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="detail_address"
                            name="detail_address"
                            value={formData.detail_address}
                            onChange={handleChange}
                            placeholder="Số nhà, tên đường..."
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_default"
                            name="is_default"
                            checked={formData.is_default}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                            Đặt làm địa chỉ mặc định
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        >
                            {loading ? 'Đang xử lý...' : address ? 'Cập nhật' : 'Thêm địa chỉ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
