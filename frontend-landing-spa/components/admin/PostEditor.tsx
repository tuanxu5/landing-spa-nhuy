'use client';

import { useState, useEffect } from 'react';
import { postsApi } from '@/lib/api';
import { postFormSchema, formatZodErrors, type PostFormData } from '@/lib/validation';
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
    status: 'draft',
    publishedAt: '',
  });

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
        status: post.status,
        publishedAt: post.publishedAt || '',
      });
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

      // Prepare data for API
      const postData = {
        title: formData.title,
        content: formData.content,
        featuredImage: formData.featuredImage || undefined,
        category: formData.category,
        status: formData.status,
        publishedAt: formData.publishedAt || undefined,
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
          status: 'draft',
          publishedAt: '',
        });
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <h3 className="text-sm font-medium text-red-800">Error loading post</h3>
            <p className="mt-1 text-sm text-red-700">{apiError}</p>
            <button
              onClick={fetchPost}
              className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {isEditMode ? 'Post updated successfully!' : 'Post created successfully!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API error message */}
        {apiError && (
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
                <p className="text-sm font-medium text-red-800">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Title field */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.title
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter post title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Content field */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={10}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.content
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter post content"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Featured Image field */}
        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
            Featured Image URL
          </label>
          <input
            type="text"
            id="featuredImage"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.featuredImage
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.featuredImage && (
            <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Optional. Enter a valid URL for the featured image.
          </p>
        </div>

        {/* Category field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.category
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          >
            <option value="service">Service</option>
            <option value="promotion">Promotion</option>
            <option value="information">Information</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Status field */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.status
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        {/* Published At field */}
        <div>
          <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
            Published Date
          </label>
          <input
            type="datetime-local"
            id="publishedAt"
            name="publishedAt"
            value={formData.publishedAt}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.publishedAt
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.publishedAt && (
            <p className="mt-1 text-sm text-red-600">{errors.publishedAt}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Optional. Leave empty to use the current date/time when publishing.
          </p>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>{isEditMode ? 'Update Post' : 'Create Post'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
