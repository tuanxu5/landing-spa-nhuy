/**
 * API client utility for communicating with the backend API
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Booking,
  CreateBookingDto,
  UpdateBookingDto,
  BookingFilters,
  PaginatedBookings,
  Post,
  CreatePostDto,
  UpdatePostDto,
  PostFilters,
  LoginDto,
  LoginResponse,
  ChangePasswordDto,
  Administrator,
  ApiError,
} from '@/types';
import { getSessionToken, clearSession } from './auth';

// Base URL configuration - defaults to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
  });

  // Request interceptor to add authentication token
  client.interceptors.request.use(
    (config) => {
      const token = getSessionToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
      // Handle 401 Unauthorized - clear session and redirect to login
      if (error.response?.status === 401) {
        clearSession();
        // Only redirect if we're in the browser and not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }

      // Transform error to a consistent format
      const apiError: ApiError = {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        errors: error.response?.data?.errors,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
};

// Create singleton instance
const apiClient = createApiClient();

/**
 * Bookings API
 */
export const bookingsApi = {
  /**
   * Create a new booking
   */
  create: async (data: CreateBookingDto): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/api/bookings', data);
    return response.data;
  },

  /**
   * Get all bookings with optional filters and pagination
   */
  getAll: async (filters?: BookingFilters): Promise<PaginatedBookings> => {
    const response = await apiClient.get<PaginatedBookings>('/api/bookings', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single booking by ID
   */
  getById: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/api/bookings/${id}`);
    return response.data;
  },

  /**
   * Update booking status
   */
  updateStatus: async (id: string, data: UpdateBookingDto): Promise<Booking> => {
    const response = await apiClient.patch<Booking>(`/api/bookings/${id}`, data);
    return response.data;
  },
};

/**
 * Posts API
 */
export const postsApi = {
  /**
   * Create a new post
   */
  create: async (data: CreatePostDto): Promise<Post> => {
    const response = await apiClient.post<Post>('/api/posts', data);
    return response.data;
  },

  /**
   * Get all posts with optional filters
   */
  getAll: async (filters?: PostFilters): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/api/posts', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single post by ID
   */
  getById: async (id: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/api/posts/${id}`);
    return response.data;
  },

  /**
   * Update an existing post
   */
  update: async (id: string, data: UpdatePostDto): Promise<Post> => {
    const response = await apiClient.put<Post>(`/api/posts/${id}`, data);
    return response.data;
  },

  /**
   * Delete a post
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}`);
  },
};

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login with username and password
   */
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  },

  /**
   * Logout and invalidate session
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/api/auth/logout');
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await apiClient.post('/api/auth/change-password', data);
  },

  /**
   * Get current authenticated administrator
   */
  me: async (): Promise<Administrator> => {
    const response = await apiClient.get<Administrator>('/api/auth/me');
    return response.data;
  },
};

/**
 * Dashboard API
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<{
    totalBookings: number;
    pendingBookings: number;
    publishedPosts: number;
  }> => {
    // Fetch bookings and posts in parallel
    const [bookingsData, pendingData, allPosts] = await Promise.all([
      bookingsApi.getAll({ limit: 1 }), // Just get total count
      bookingsApi.getAll({ status: 'pending', limit: 1 }), // Get pending count
      postsApi.getAll({ status: 'published' }),
    ]);

    // Calculate statistics from pagination metadata
    const totalBookings = bookingsData.total;
    const pendingBookings = pendingData.total;
    const publishedPosts = allPosts.length;

    return {
      totalBookings,
      pendingBookings,
      publishedPosts,
    };
  },
};

/**
 * Upload API
 */
export const uploadApi = {
  /**
   * Upload an image file
   */
  uploadImage: async (file: File): Promise<{ filename: string; path: string; size: number; mimetype: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default apiClient;
