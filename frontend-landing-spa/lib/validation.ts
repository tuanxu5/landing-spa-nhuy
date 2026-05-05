/**
 * Form validation utilities using Zod
 */

import { z } from 'zod';

/**
 * Booking form validation schema
 */
export const bookingFormSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Vui lòng nhập họ và tên')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự')
    .regex(/^[a-zA-ZÀ-ỹ\s-]+$/, 'Họ và tên chỉ được chứa chữ cái, khoảng trắng và dấu gạch ngang'),
  
  phone: z
    .string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Số điện thoại không hợp lệ')
    .refine((phone) => phone.replace(/\D/g, '').length >= 10, 'Số điện thoại phải có ít nhất 10 chữ số'),
  
  service: z
    .string()
    .min(1, 'Vui lòng chọn dịch vụ'),
  
  preferredDate: z
    .string()
    .min(1, 'Vui lòng chọn ngày hẹn')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Ngày hẹn phải là hôm nay hoặc trong tương lai'),
  
  preferredTime: z
    .string()
    .min(1, 'Vui lòng chọn giờ hẹn')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ hẹn không hợp lệ (định dạng HH:MM)'),
  
  notes: z
    .string()
    .optional(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

/**
 * Login form validation schema
 */
export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters'),
  
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * Password change form validation schema
 */
export const passwordChangeFormSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number'),
  
  confirmPassword: z
    .string()
    .min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeFormSchema>;

/**
 * Post form validation schema
 */
export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  content: z
    .string()
    .min(1, 'Content is required'),
  
  featuredImage: z
    .string()
    .url('Invalid URL format')
    .optional()
    .or(z.literal('')),
  
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  
  status: z.enum(['draft', 'published'], {
    message: 'Invalid status',
  }),
  
  publishedAt: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type PostFormData = z.infer<typeof postFormSchema>;

/**
 * Utility function to format validation errors from Zod
 */
export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate name format (letters, spaces, hyphens only)
 */
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s-]+$/;
  return nameRegex.test(name);
};

/**
 * Validate date is not in the past
 */
export const validateDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};
