/**
 * TypeScript type definitions for the Spa Booking Landing Page
 */

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string; // ISO date string
  preferredTime: string; // HH:MM format
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDto {
  customerName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export interface UpdateBookingDto {
  status: BookingStatus;
}

// Post types
export type PostCategory = 'service' | 'promotion' | 'information';
export type PostStatus = 'draft' | 'published';

export interface Post {
  _id: string;
  title: string;
  content: string;
  featuredImage?: string;
  category: PostCategory;
  status: PostStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
  featuredImage?: string;
  category: PostCategory;
  status: PostStatus;
  publishedAt?: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  featuredImage?: string;
  category?: PostCategory;
  status?: PostStatus;
  publishedAt?: string;
}

// Administrator types
export interface Administrator {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
  administrator: Administrator;
}

// API Error types
export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Query parameters
export interface BookingFilters {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  service?: string;
}

export interface PostFilters {
  category?: PostCategory;
  status?: PostStatus;
}
