'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { postsApi } from '@/lib/api';
import type { Post } from '@/types';

export default function Services() {
  const [services, setServices] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const posts = await postsApi.getAll({
          category: 'service',
          status: 'published',
        });
        setServices(posts);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Không thể tải dịch vụ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span className="text-primary-700 text-sm font-semibold uppercase tracking-wide">
                Dịch Vụ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dịch Vụ <span className="text-primary-600">Của Chúng Tôi</span>
            </h2>
          </div>

          {/* Loading skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span className="text-primary-700 text-sm font-semibold uppercase tracking-wide">
                Dịch Vụ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dịch Vụ <span className="text-primary-600">Của Chúng Tôi</span>
            </h2>
          </div>

          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer"
            >
              Thử Lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (services.length === 0) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
              <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
              <span className="text-primary-700 text-sm font-semibold uppercase tracking-wide">
                Dịch Vụ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dịch Vụ <span className="text-primary-600">Của Chúng Tôi</span>
            </h2>
          </div>

          <div className="text-center text-gray-600">
            <p>Hiện chưa có dịch vụ nào. Vui lòng quay lại sau.</p>
          </div>
        </div>
      </section>
    );
  }

  // Services display
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            <span className="text-primary-700 text-sm font-semibold uppercase tracking-wide">
              Dịch Vụ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Dịch Vụ <span className="text-primary-600">Của Chúng Tôi</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá các liệu pháp spa cao cấp được thiết kế để làm mới cơ thể và tâm trí bạn
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Service image */}
              <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                {service.featuredImage ? (
                  <Image
                    src={service.featuredImage}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                    <svg
                      className="w-20 h-20 text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Service details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {service.content}
                </p>
                
                {/* Read more link */}
                <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                  <span>Tìm hiểu thêm</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
