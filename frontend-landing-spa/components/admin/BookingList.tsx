'use client';

import { useState, useEffect, useMemo } from 'react';
import { bookingsApi } from '@/lib/api';
import type { Booking, BookingStatus, ApiError } from '@/types';
import { Card, Badge } from '@/components/ui';

interface BookingListProps {
  filters?: {
    status?: BookingStatus;
    startDate?: string;
    endDate?: string;
    service?: string;
  };
  onStatusUpdate?: () => void;
}

export default function BookingList({ filters, onStatusUpdate }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Memoize filters để tránh re-render không cần thiết
  const filterString = useMemo(() => JSON.stringify(filters || {}), [filters]);

  // Fetch bookings when filters change
  useEffect(() => {
    fetchBookings();
  }, [filterString]); // Chỉ phụ thuộc vào filterString

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingsApi.getAll(filters);
      setBookings(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Không thể tải danh sách đặt lịch');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      setUpdatingId(bookingId);
      setError(null);
      await bookingsApi.updateStatus(bookingId, { status: newStatus });
      
      // Refresh bookings list after successful update
      await fetchBookings();
      
      // Notify parent component if callback provided
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Không thể cập nhật trạng thái đặt lịch');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" dot>Chờ xác nhận</Badge>;
      case 'confirmed':
        return <Badge variant="info" dot>Đã xác nhận</Badge>;
      case 'completed':
        return <Badge variant="success" dot>Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot>Đã hủy</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card variant="bordered" padding="md" className="border-red-200 bg-red-50">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-red-900 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-700 mb-3">{error}</p>
            <button
              onClick={fetchBookings}
              className="text-sm font-medium text-red-800 hover:text-red-900 underline cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        </div>
      </Card>
    );
  }

  // Empty state
  if (bookings.length === 0) {
    return (
      <Card variant="elevated" padding="lg">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy đặt lịch</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters && Object.keys(filters).length > 0
              ? 'Thử điều chỉnh bộ lọc để xem thêm kết quả.'
              : 'Các đặt lịch sẽ xuất hiện ở đây khi khách hàng đặt dịch vụ.'}
          </p>
        </div>
      </Card>
    );
  }

  // Bookings table
  return (
    <Card variant="elevated" padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Khách hàng
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Liên hệ
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Dịch vụ
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Ngày & Giờ
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-700">
                        {booking.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{booking.customerName}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{booking.email}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{booking.service}</div>
                  {booking.notes && (
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={booking.notes}>
                      💬 {booking.notes}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatDate(booking.preferredDate)}</div>
                  <div className="text-sm text-gray-500">{booking.preferredTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {updatingId === booking._id ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {updatingId === booking._id ? 'Đang xử lý...' : 'Hủy'}
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {updatingId === booking._id ? 'Đang xử lý...' : 'Hoàn thành'}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          {updatingId === booking._id ? 'Đang xử lý...' : 'Hủy'}
                        </button>
                      </>
                    )}
                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                      <span className="text-xs text-gray-400 italic">Không có thao tác</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
