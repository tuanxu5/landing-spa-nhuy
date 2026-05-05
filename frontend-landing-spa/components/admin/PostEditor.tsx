'use client';

import { useState, useEffect } from 'react';
import { postsApi } from '@/lib/api';
import { postFormSchema, formatZodErrors, type PostFormData } from '@/lib/validation';
import { Card, Input, Button } from '@/components/ui';
import type { Post, PostCategory, PostStatus, ApiError } from '@/types';

interface PostEditorProps {
  postId?: string; // undefined for create mode, string for edit mode
  onSave?: (post: Post) => void;
}

export default function PostEditor({ postId, onSave }: PostEditorProps) {
  const isEditMode = !!postId;

  // Form state
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    featuredImage: '',
    category: 'service',
    status: 'published', // Always published
    publishedAt: '', // Will be set by backend
  });

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // UI state
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch existing post data in edit mode
  useEffect(() => {
    if (isEditMode && postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const post = await postsApi.getById(postId!);
      
      // Populate form with existing post data
      setFormData({
        title: post.title,
        content: post.content,
        featuredImage: post.featuredImage || '',
        category: post.category,
        status: 'published',
        publishedAt: '',
      });
      
      // Set image preview if exists
      if (post.featuredImage) {
        setImagePreview(post.featuredImage);
      }
    } catch (err) {
      const error = err as ApiError;
      setApiError(error.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear success message when user makes changes
    if (success) {
      setSuccess(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, featuredImage: 'Vui lòng chọn file ảnh' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, featuredImage: 'Kích thước ảnh tối đa 5MB' }));
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.featuredImage) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.featuredImage;
          return newErrors;
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData((prev) => ({ ...prev, featuredImage: '' }));
  };

  const validateForm = (): boolean => {
    try {
      // Validate form data with Zod schema
      postFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err: any) {
      // Format Zod validation errors
      const validationErrors = formatZodErrors(err);
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setApiError(null);
    setSuccess(false);

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // Upload image first if there's a new file
      let imageUrl = formData.featuredImage;
      if (imageFile) {
        setUploadingImage(true);
        // TODO: Implement actual image upload to your storage service
        // For now, we'll use the preview URL (base64)
        imageUrl = imagePreview;
        setUploadingImage(false);
      }

      // Prepare data for API
      const postData = {
        title: formData.title,
        content: formData.content,
        featuredImage: imageUrl || undefined,
        category: formData.category,
        status: 'published' as PostStatus,
        publishedAt: new Date().toISOString(), // Current time
      };

      let savedPost: Post;

      if (isEditMode) {
        // Update existing post
        savedPost = await postsApi.update(postId!, postData);
      } else {
        // Create new post
        savedPost = await postsApi.create(postData);
      }

      // Show success message
      setSuccess(true);

      // Reset form in create mode
      if (!isEditMode) {
        setFormData({
          title: '',
          content: '',
          featuredImage: '',
          category: 'service',
          status: 'published',
          publishedAt: '',
        });
        setImageFile(null);
        setImagePreview('');
      }

      // Notify parent component
      if (onSave) {
        onSave(savedPost);
      }
    } catch (err) {
      const error = err as ApiError;
      
      // Handle validation errors from API
      if (error.errors && error.errors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          fieldErrors[err.field] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        setApiError(error.message || 'Failed to save post');
      }
    } finally {
      setSaving(false);
    }
  };

  // Loading state for edit mode
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Error state for failed post fetch
  if (apiError && isEditMode && !formData.title) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Lỗi tải bài viết</h3>
            <p className="mt-1 text-sm text-red-700">{apiError}</p>
            <button
              onClick={fetchPost}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Form - 2 columns */}
      <div className="lg:col-span-2">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-800 mb-1">Thành công!</h3>
                    <p className="text-sm text-green-700">
                      {isEditMode ? 'Bài viết đã được cập nhật.' : 'Bài viết mới đã được tạo.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* API error message */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800 mb-1">Lỗi</h3>
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Title field */}
            <div>
              <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Tiêu đề <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
              />
            </div>

            {/* Content field */}
            <div>
              <label htmlFor="content" className="flex items-center text-sm font-semibold text-gray-900 mb-2">
                <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Nội dung <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={12}
                className={`block w-full rounded-lg border shadow-sm text-sm transition-colors resize-none p-3 ${
                  errors.content
                    ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                }`}
                placeholder="Viết nội dung bài viết của bạn tại đây..."
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

            {/* Submit button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Trường bắt buộc
              </p>
              <Button
                type="submit"
                disabled={saving}
                size="lg"
                leftIcon={
                  saving ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )
                }
              >
                {saving ? 'Đang lưu...' : (isEditMode ? 'Cập nhật bài viết' : 'Tạo bài viết')}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Sidebar - Settings & Preview */}
      <div className="lg:col-span-1 space-y-6">
        {/* Settings Card */}
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt bài viết
          </h3>

          <div className="space-y-4">
            {/* Category field */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`block w-full rounded-lg shadow-sm text-sm cursor-pointer transition-colors ${
                  errors.category
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              >
                <option value="service">🛎️ Dịch vụ</option>
                <option value="promotion">🎁 Khuyến mãi</option>
                <option value="information">ℹ️ Thông tin</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Status field */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`block w-full rounded-lg shadow-sm text-sm cursor-pointer transition-colors ${
                  errors.status
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
              >
                <option value="draft">📝 Bản nháp</option>
                <option value="published">✅ Đã xuất bản</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>

            {/* Published At field */}
            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
                Ngày xuất bản
              </label>
              <Input
                type="datetime-local"
                id="publishedAt"
                name="publishedAt"
                value={formData.publishedAt}
                onChange={handleInputChange}
                error={errors.publishedAt}
              />
              <p className="mt-1 text-xs text-gray-500">
                Để trống để dùng thời gian hiện tại
              </p>
            </div>
          </div>
        </Card>

        {/* Featured Image Card */}
        <Card>
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ảnh đại diện
          </h3>

          <div className="space-y-3">
            <Input
              type="text"
              id="featuredImage"
              name="featuredImage"
              value={formData.featuredImage}
              onChange={handleInputChange}
              error={errors.featuredImage}
              placeholder="https://example.com/image.jpg"
            />

            {/* Image Preview */}
            {formData.featuredImage && (
              <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {!formData.featuredImage && (
              <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Chưa có ảnh</p>
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Nhập URL ảnh để hiển thị preview
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
