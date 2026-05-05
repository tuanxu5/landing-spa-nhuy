'use client';

/**
 * BookingForm Component
 * 
 * Provides a form for customers to submit booking requests.
 * Implements client-side validation, API submission, and user feedback.
 * 
 * Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 6.1, 6.3, 7.5, 7.6, 12.1, 12.2, 12.3, 12.4, 12.6
 */

import { useState, useEffect } from 'react';
import { bookingsApi, postsApi } from '@/lib/api';
import { bookingFormSchema, formatZodErrors } from '@/lib/validation';
import type { Post, ApiError } from '@/types';
import { z } from 'zod';

interface FormData {
  customerName: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  const [services, setServices] = useState<Post[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch available services for the dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const posts = await postsApi.getAll({
          category: 'service',
          status: 'published',
        });
        setServices(posts);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setErrors({});
    setApiError(null);
    setSuccess(false);

    // Client-side validation
    try {
      bookingFormSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(formatZodErrors(err));
        return;
      }
    }

    // Submit to API
    try {
      setSubmitting(true);
      
      await bookingsApi.create({
        customerName: formData.customerName,
        phone: formData.phone,
        service: formData.service,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        notes: formData.notes || undefined,
      });

      // Success - reset form and show success message
      setSuccess(true);
      setFormData({
        customerName: '',
        phone: '',
        service: '',
        preferredDate: '',
        preferredTime: '',
        notes: '',
      });

      // Scroll to top of form to show success message
      const formElement = document.getElementById('booking-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      const error = err as ApiError;
      
      // Handle validation errors from API
      if (error.errors && error.errors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((e) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setApiError(error.message || 'Failed to submit booking. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            <span className="text-primary-700 text-sm font-semibold uppercase tracking-wide">
              Đặt Lịch
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Đặt Lịch <span className="text-primary-600">Ngay Hôm Nay</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Điền thông tin bên dưới và chúng tôi sẽ xác nhận lịch hẹn của bạn trong thời gian sớm nhất
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-green-900 font-bold text-lg mb-2">
                  Đặt Lịch Thành Công!
                </h3>
                <p className="text-green-700 leading-relaxed">
                  Cảm ơn bạn đã đặt lịch. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API error message */}
        {apiError && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-red-900 font-bold text-lg mb-2">
                  Gửi Thất Bại
                </h3>
                <p className="text-red-700 leading-relaxed">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {/* Customer Name */}
          <div className="mb-6">
            <label
              htmlFor="customerName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Họ và Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${
                errors.customerName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="Nguyễn Văn A"
            />
            {errors.customerName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.customerName}
              </p>
            )}
          </div>

{/* Phone */}
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Số Điện Thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-base ${
                errors.phone
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
              placeholder="0912 345 678"
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Service Selection */}
          <div className="mb-6">
            <label
              htmlFor="service"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Chọn Dịch Vụ <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-base cursor-pointer ${
                errors.service
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
              }`}
            >
              <option value="">Chọn dịch vụ...</option>
              {services.map((service) => (
                <option key={service._id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.service}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Preferred Date */}
            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Ngày Hẹn <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={today}
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-base cursor-pointer ${
                  errors.preferredDate
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
              />
              {errors.preferredDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.preferredDate}
                </p>
              )}
            </div>

            {/* Preferred Time */}
            <div>
              <label
                htmlFor="preferredTime"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Giờ Hẹn <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-base cursor-pointer ${
                  errors.preferredTime
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
                }`}
              />
              {errors.preferredTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.preferredTime}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label
              htmlFor="notes"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Ghi Chú (Tùy chọn)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-100 transition-all text-base resize-none"
              placeholder="Yêu cầu đặc biệt hoặc sở thích của bạn..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 px-6 text-lg font-bold text-white rounded-xl transition-all duration-300 min-h-[56px] cursor-pointer ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-200 transform hover:scale-[1.02] shadow-lg hover:shadow-2xl hover:shadow-primary-600/50'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-6 w-6 text-white"
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
                Đang Gửi...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Đặt Lịch Ngay
              </span>
            )}
          </button>

          <p className="mt-4 text-sm text-gray-500 text-center">
            <span className="text-red-500">*</span> Thông tin bắt buộc
          </p>
        </form>
      </div>
    </section>
  );
}
