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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Khách hàng
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Dịch vụ
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Ngày & Giờ
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Trạng thái
              </th>
              <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-primary-50/30 transition-colors group">
                {/* Customer */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-white">
                        {booking.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{booking.customerName}</div>
                      <div className="text-xs text-gray-500">{booking.phone}</div>
                    </div>
                  </div>
                </td>

                {/* Service */}
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-gray-900">{booking.service}</div>
                  {booking.notes && (
                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate flex items-center gap-1" title={booking.notes}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      {booking.notes}
                    </div>
                  )}
                </td>

                {/* Date & Time */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900">{formatDate(booking.preferredDate)}</div>
                      <div className="text-xs text-gray-500">{booking.preferredTime}</div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-1.5 justify-center">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          disabled={updatingId === booking._id}
                          className="w-8 h-8 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-105 shadow-sm"
                          title="Xác nhận"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          disabled={updatingId === booking._id}
                          className="w-8 h-8 flex items-center justify-center text-red-700 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-105"
                          title="Hủy"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                          disabled={updatingId === booking._id}
                          className="w-8 h-8 flex items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-105 shadow-sm"
                          title="Hoàn thành"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          disabled={updatingId === booking._id}
                          className="w-8 h-8 flex items-center justify-center text-red-700 bg-red-50 hover:bg-red-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-105"
                          title="Hủy"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}
                    {(booking.status === 'completed' || booking.status === 'cancelled') && (
                      <span className="text-xs text-gray-400 italic px-2">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="text-sm text-gray-600">
          Tổng cộng: <span className="font-semibold text-primary-600">{bookings.length}</span> đặt lịch
        </div>
      </div>
    </div>
  );
}
