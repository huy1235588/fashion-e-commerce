'use client';

import { useState, useEffect } from 'react';
import { Address } from '@/types';
import { addressService } from '@/services/address.service';
import AddressCard from '@/components/address/AddressCard';
import AddressForm from '@/components/address/AddressForm';
import PrivateRoute from '@/components/auth/PrivateRoute';
import ErrorMessage from '@/components/common/ErrorMessage';
import { toast } from '@/components/common/Toast';
import { FiPlus } from 'react-icons/fi';

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>();
    const [error, setError] = useState('');

    useEffect(() => {
        loadAddresses();
    }, []);

    const loadAddresses = async () => {
        try {
            setLoading(true);
            const data = await addressService.getAddresses();
            setAddresses(data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Không thể tải danh sách địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: any) => {
        await addressService.createAddress(data);
        setShowForm(false);
        toast.success('Thêm địa chỉ thành công');
        loadAddresses();
    };

    const handleUpdate = async (data: any) => {
        if (editingAddress) {
            await addressService.updateAddress(editingAddress.id, data);
            setShowForm(false);
            setEditingAddress(undefined);
            toast.success('Cập nhật địa chỉ thành công');
            loadAddresses();
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
            try {
                await addressService.deleteAddress(id);
                toast.success('Đã xóa địa chỉ');
                loadAddresses();
            } catch (err: any) {
                toast.error(err.response?.data?.error || 'Không thể xóa địa chỉ');
            }
        }
    };

    const handleSetDefault = async (id: number) => {
        try {
            await addressService.setDefaultAddress(id);
            toast.success('Đã đặt địa chỉ mặc định');
            loadAddresses();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Không thể đặt địa chỉ mặc định');
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingAddress(undefined);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <PrivateRoute>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Địa chỉ của tôi</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FiPlus size={20} />
                        Thêm địa chỉ mới
                    </button>
                </div>

                {error && <ErrorMessage message={error} className="mb-6" />}

                {addresses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus size={20} />
                            Thêm địa chỉ đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
                        ))}
                    </div>
                )}

                {showForm && (
                    <AddressForm
                        address={editingAddress}
                        onSubmit={editingAddress ? handleUpdate : handleCreate}
                        onCancel={handleCloseForm}
                    />
                )}
            </div>
        </PrivateRoute>
    );
}
