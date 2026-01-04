'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { apiClient } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

interface ImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

export default function ImageUpload({ 
    images, 
    onImagesChange, 
    maxImages = 5,
    disabled = false 
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            alert(`Chỉ có thể tải lên tối đa ${maxImages} ảnh`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        const newImages: string[] = [];

        setUploading(true);
        try {
            for (const file of filesToUpload) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert(`File ${file.name} không phải là ảnh`);
                    continue;
                }

                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    alert(`File ${file.name} quá lớn (tối đa 10MB)`);
                    continue;
                }

                // Upload to server temporarily (to /uploads/temp)
                const formData = new FormData();
                formData.append('image', file);

                try {
                    const response = await apiClient.post<{ data: { path: string } }>('/upload/temp', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    
                    // Use server path instead of blob URL
                    newImages.push(response.data.path);
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    // Fallback to blob URL if upload fails
                    const previewUrl = URL.createObjectURL(file);
                    newImages.push(previewUrl);
                }
            }

            onImagesChange([...images, ...newImages]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Có lỗi xảy ra khi tải ảnh');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const handleSetPrimary = (index: number) => {
        if (index === 0) return; // Already primary
        const newImages = [...images];
        const [primaryImage] = newImages.splice(index, 1);
        newImages.unshift(primaryImage);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            <div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || uploading || images.length >= maxImages}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FiUpload className="w-5 h-5" />
                    <span>
                        {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                    </span>
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <p className="text-sm text-gray-500 mt-2">
                    Tối đa {maxImages} ảnh, mỗi ảnh tối đa 10MB. Định dạng: JPG, PNG, WebP
                </p>
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                                index === 0 ? 'border-blue-500' : 'border-gray-200'
                            }`}
                        >
                            <img
                                src={getImageUrl(image)}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetPrimary(index)}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            title="Đặt làm ảnh chính"
                                        >
                                            Ảnh chính
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        title="Xóa ảnh"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Primary Badge */}
                            {index === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                                    Ảnh chính
                                </div>
                            )}

                            {/* Image Number */}
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                                {index + 1}/{images.length}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {images.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FiImage className="w-16 h-16 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-center">
                        Chưa có ảnh nào<br />
                        <span className="text-sm">Nhấn nút &quot;Chọn ảnh&quot; để tải lên</span>
                    </p>
                </div>
            )}
        </div>
    );
}
