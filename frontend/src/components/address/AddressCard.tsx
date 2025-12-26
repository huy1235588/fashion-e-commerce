'use client';

import { Address } from '@/types';
import { FiMapPin, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (id: number) => void;
    onSetDefault: (id: number) => void;
}

export default function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}: AddressCardProps) {
    const fullAddress = `${address.detail_address}, ${address.ward}, ${address.district}, ${address.province}`;

    return (
        <div className={`border rounded-lg p-4 ${address.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-2">
                    <FiMapPin className="text-gray-400 mt-1 shrink-0" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{address.full_name}</h3>
                            {address.is_default && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <FiCheck size={12} />
                                    Mặc định
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(address)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                    >
                        <FiEdit2 size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(address.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{fullAddress}</p>

            {!address.is_default && (
                <button
                    onClick={() => onSetDefault(address.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Đặt làm địa chỉ mặc định
                </button>
            )}
        </div>
    );
}
