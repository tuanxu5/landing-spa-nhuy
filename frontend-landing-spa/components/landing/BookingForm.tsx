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
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
}

export default function BookingForm() {
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    email: '',
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
        email: formData.email,
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
        email: '',
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
    <section id="booking-form" className="w-full py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Book Your Appointment
          </h2>
          <p className="text-base sm:text-lg md:text-lg text-gray-600 dark:text-gray-400 px-2">
            Fill out the form below and we'll confirm your booking shortly
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-green-800 dark:text-green-300 font-semibold mb-1">
                  Booking Submitted Successfully!
                </h3>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Thank you for your booking request. We'll contact you shortly to confirm your appointment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API error message */}
        {apiError && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-red-800 dark:text-red-300 font-semibold mb-1">
                  Submission Failed
                </h3>
                <p className="text-red-700 dark:text-red-400 text-sm">{apiError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-5 sm:p-6 md:p-8">
          {/* Customer Name */}
          <div className="mb-5 sm:mb-5 md:mb-6">
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 sm:py-3 md:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-base ${
                errors.customerName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 dark:bg-gray-800 dark:text-white'
              }`}
              placeholder="John Doe"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerName}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5 sm:mb-5 md:mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-base ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 dark:bg-gray-800 dark:text-white'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-5 sm:mb-5 md:mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-base ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 dark:bg-gray-800 dark:text-white'
              }`}
              placeholder="555-0123"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Service Selection */}
          <div className="mb-5 sm:mb-5 md:mb-6">
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Service <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-base ${
                errors.service
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 dark:bg-gray-800 dark:text-white'
              }`}
            >
              <option value="">Choose a service...</option>
              {services.map((service) => (
                <option key={service._id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.service}</p>
            )}
          </div>

          {/* Date and Time - Optimized for tablet with better spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-5 md:gap-6 mb-5 sm:mb-5 md:mb-6">
            {/* Preferred Date */}
            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={today}
                className={`w-full px-4 py-3.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-base ${
                  errors.preferredDate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 dark:bg-gray-800 dark:text-white'
                }`}
              />
              {errors.preferredDate && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredDate}</p>
              )}
            </div>

            {/* Preferred Time */}
            <div>
              <label
                htmlFor="preferredTime"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-base ${
                  errors.preferredTime
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500 dark:bg-gray-800 dark:text-white'
                }`}
              />
              {errors.preferredTime && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.preferredTime}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6 sm:mb-7 md:mb-8">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors dark:bg-gray-800 dark:text-white text-base"
              placeholder="Any special requests or preferences..."
            />
          </div>

          {/* Submit Button - Touch-friendly size (min 44x44px) */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-4 px-6 text-base sm:text-lg font-semibold text-white rounded-lg transition-all duration-300 min-h-[48px] ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 dark:focus:ring-teal-800 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Submitting...
              </span>
            ) : (
              'Submit Booking Request'
            )}
          </button>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            <span className="text-red-500">*</span> Required fields
          </p>
        </form>
      </div>
    </section>
  );
}
