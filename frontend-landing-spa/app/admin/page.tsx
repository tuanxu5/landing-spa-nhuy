'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { dashboardApi } from '@/lib/api';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  publishedPosts: number;
}

export default function AdminDashboard() {
  const { administrator } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats:', err);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Welcome header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Tổng quan
                </h1>
                <p className="text-base text-gray-600">
                  Chào mừng trở lại, <span className="font-semibold text-primary-600">{administrator?.username}</span>! 
                  Đây là tổng quan quản lý spa của bạn.
                </p>
              </div>
              <div className="hidden md:block">
                <Badge variant="primary" size="md" dot>
                  Quản trị viên
                </Badge>
              </div>
            </div>
          </div>

          {/* Statistics cards */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} variant="elevated" padding="md">
                  <div className="animate-pulse">
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card variant="bordered" padding="md" className="border-red-200 bg-red-50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-red-900 mb-1">
                    Lỗi tải thống kê
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Bookings Card */}
              <Link href="/admin/bookings">
                <Card variant="elevated" padding="md" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <Badge variant="info" size="sm">Tất cả</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Tổng đặt lịch
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {stats?.totalBookings || 0}
                    </p>
                    <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                      Xem tất cả
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </Card>
              </Link>

              {/* Pending Bookings Card */}
              <Link href="/admin/bookings?status=pending">
                <Card variant="elevated" padding="md" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <Badge variant="warning" size="sm" dot>Chờ duyệt</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Đặt lịch chờ duyệt
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {stats?.pendingBookings || 0}
                    </p>
                    <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                      Xem chi tiết
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </Card>
              </Link>

              {/* Published Posts Card */}
              <Link href="/admin/posts">
                <Card variant="elevated" padding="md" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <Badge variant="success" size="sm">Đã xuất bản</Badge>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Bài viết đã xuất bản
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {stats?.publishedPosts || 0}
                    </p>
                    <p className="text-xs text-primary-600 font-medium flex items-center gap-1">
                      Quản lý bài viết
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
