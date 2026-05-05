'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postsApi } from '@/lib/api';
import type { Post } from '@/types';
import ServiceModal from '@/components/admin/ServiceModal';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Post[]>([]);
  const [filteredServices, setFilteredServices] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Post | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search query
    if (searchQuery.trim()) {
      const filtered = services.filter(
        (service) =>
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchQuery, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await postsApi.getAll({ category: 'service' });
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Post) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await postsApi.delete(id);
      fetchServices();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleModalSuccess = () => {
    fetchServices();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản Lý Dịch Vụ</h1>
            <p className="text-gray-600">Thêm, sửa, xóa các dịch vụ spa của bạn</p>
          </div>

        {/* Search and Add */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm dịch vụ..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm Dịch Vụ
            </button>
          </div>

          {/* Results count */}
          {searchQuery && (
            <div className="mt-4 text-sm text-gray-600">
              Tìm thấy <span className="font-semibold text-primary-600">{filteredServices.length}</span> dịch vụ
            </div>
          )}
        </div>

        {/* Services List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="flex items-center gap-3 p-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'Không tìm thấy dịch vụ' : 'Chưa có dịch vụ nào'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Thử tìm kiếm với từ khóa khác'
                : 'Bắt đầu bằng cách thêm dịch vụ đầu tiên của bạn'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAdd}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Thêm Dịch Vụ Đầu Tiên
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-3 p-3">
                  {/* Image - Small Square */}
                  <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {service.featuredImage ? (
                      <img
                        src={service.featuredImage}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-7 h-7 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Title and Actions */}
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2">
                      {service.title}
                    </h3>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(service)}
                        className="w-7 h-7 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center cursor-pointer"
                        title="Sửa"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className={`w-7 h-7 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                          deleteConfirm === service._id
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                        title={deleteConfirm === service._id ? 'Xác nhận xóa' : 'Xóa'}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total count */}
        {!loading && filteredServices.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Tổng cộng: <span className="font-semibold text-primary-600">{filteredServices.length}</span> dịch vụ
          </div>
        )}
      </div>

      {/* Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        service={selectedService}
      />
    </div>
    </ProtectedRoute>
  );
}
