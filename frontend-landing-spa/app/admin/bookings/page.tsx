'use client';

import { useState } from 'react';
import BookingList from '@/components/admin/BookingList';
import BookingFilters from '@/components/admin/BookingFilters';
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
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Bookings Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all customer bookings. Filter by status, date range, or service type.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <BookingFilters onFilterChange={handleFilterChange} />
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <BookingList filters={filters} />
        </div>
      </div>
    </div>
  );
}
