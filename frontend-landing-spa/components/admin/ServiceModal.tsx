'use client';

import { useState, useEffect } from 'react';
import { postsApi } from '@/lib/api';
import type { Post } from '@/types';
import { Input } from '@/components/ui';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: Post | null;
}

export default function ServiceModal({ isOpen, onClose, onSuccess, service }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        content: service.content,
        featuredImage: service.featuredImage || '',
      });
      setImagePreview(service.featuredImage || '');
    } else {
      setFormData({ title: '', content: '', featuredImage: '' });
      setImagePreview('');
      setImageFile(null);
    }
    setErrors({});
  }, [service, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Kích thước ảnh không được vượt quá 5MB' });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tên dịch vụ';
    if (!formData.content.trim()) newErrors.content = 'Vui lòng nhập mô tả dịch vụ';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.featuredImage;

      // Upload image if new file selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);

        const response = await fetch('http://localhost:3000/api/upload/image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) throw new Error('Upload ảnh thất bại');

        const data = await response.json();
        imageUrl = `http://localhost:3000${data.path}`;
      }

      const postData = {
        title: formData.title,
        content: formData.content,
        featuredImage: imageUrl,
        category: 'service',
        status: 'published' as const,
        publishedAt: new Date().toISOString(),
      };

      if (service) {
        await postsApi.update(service._id, postData);
      } else {
        await postsApi.create(postData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {service ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên Dịch Vụ <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ví dụ: Massage Thư Giãn"
              error={errors.title}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô Tả Dịch Vụ <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                errors.content
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="Mô tả chi tiết về dịch vụ..."
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.content}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hình Ảnh Dịch Vụ
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      setFormData({ ...formData, featuredImage: '' });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Nhấn để chọn ảnh</span> hoặc kéo thả
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (tối đa 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang lưu...
                </span>
              ) : (
                service ? 'Cập Nhật' : 'Thêm Mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
