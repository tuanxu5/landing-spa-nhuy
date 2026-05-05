'use client';

import { useState } from 'react';
import BookingList from '@/components/admin/BookingList';
import BookingFilters from '@/components/admin/BookingFilters';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import type { BookingStatus } from '@/types';

export default function BookingsPage() {
  const [filters, setFilters] = useState<{
    status?: BookingStatus;
    startDate?: string;
    endDate?: string;
    service?: string;
  }>({});

  const handleFilterChange = (newFilters: {
    status?: BookingStatus;
    startDate?: string;
    endDate?: string;
    service?: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Quản lý đặt lịch</h1>
            <p className="text-base text-gray-600">
              Xem và quản lý tất cả lịch đặt của khách hàng. Lọc theo trạng thái, ngày hoặc dịch vụ.
            </p>
          </div>

          <div className="space-y-6">
            <BookingFilters onFilterChange={handleFilterChange} />
            <BookingList filters={filters} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
