'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Input, Select } from '@/components/ui';
import type { BookingStatus } from '@/types';

interface BookingFiltersProps {
  onFilterChange: (filters: {
    status?: BookingStatus;
    startDate?: string;
    endDate?: string;
    service?: string;
  }) => void;
}

export default function BookingFilters({ onFilterChange }: BookingFiltersProps) {
  const searchParams = useSearchParams();

  // Initialize filters from URL query parameters
  const [status, setStatus] = useState<BookingStatus | ''>((searchParams.get('status') as BookingStatus) || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [service, setService] = useState(searchParams.get('service') || '');

  // Notify parent when filters change
  useEffect(() => {
    const filters: {
      status?: BookingStatus;
      startDate?: string;
      endDate?: string;
      service?: string;
    } = {};

    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (service) filters.service = service;

    onFilterChange(filters);
  }, [status, startDate, endDate, service, onFilterChange]);

  const handleReset = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    setService('');
  };

  const hasActiveFilters = status || startDate || endDate || service;

  const statusLabels: Record<string, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <Select
            value={status}
            onChange={(value) => setStatus(value as BookingStatus | '')}
            options={[
              { value: '', label: 'Tất cả trạng thái' },
              { value: 'pending', label: 'Chờ xác nhận' },
              { value: 'confirmed', label: 'Đã xác nhận' },
              { value: 'completed', label: 'Hoàn thành' },
              { value: 'cancelled', label: 'Đã hủy' },
            ]}
            placeholder="Chọn trạng thái"
          />
        </div>

        {/* Start date filter */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End date filter */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Service filter */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            Dịch vụ
          </label>
          <Input
            type="text"
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            placeholder="Tìm theo dịch vụ..."
          />
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {status && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              Trạng thái: {statusLabels[status]}
              <button
                onClick={() => setStatus('')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 cursor-pointer transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {startDate && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              Từ: {startDate}
              <button
                onClick={() => setStartDate('')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 cursor-pointer transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {endDate && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              Đến: {endDate}
              <button
                onClick={() => setEndDate('')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 cursor-pointer transition-colors"
              >
                ×
              </button>
            </span>
          )}
          {service && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              Dịch vụ: {service}
              <button
                onClick={() => setService('')}
                className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary-200 cursor-pointer transition-colors"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
