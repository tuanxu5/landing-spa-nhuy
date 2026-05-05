'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroModern() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Làm Đẹp Tự Nhiên',
      subtitle: 'Tỏa Sáng Vẻ Đẹp Việt',
      description: 'Trải nghiệm dịch vụ spa cao cấp với liệu pháp thiên nhiên, mang đến sự thư giãn tuyệt đối và vẻ đẹp rạng rỡ.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80',
    },
    {
      title: 'Chăm Sóc Chuyên Sâu',
      subtitle: 'Công Nghệ Hiện Đại',
      description: 'Kết hợp tinh hoa y học cổ truyền Việt Nam với công nghệ làm đẹp tiên tiến từ Hàn Quốc và Nhật Bản.',
      image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1920&q=80',
    },
    {
      title: 'Thư Giãn Toàn Diện',
      subtitle: 'Không Gian Sang Trọng',
      description: 'Không gian yên tĩnh, thư thái với hương thơm dịu nhẹ và âm nhạc du dương, giúp bạn xả stress hoàn toàn.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Animated Content */}
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  index === currentSlide
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 absolute'
                }`}
              >
                {/* Subtitle */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 backdrop-blur-sm border border-primary-400/30 rounded-full mb-6">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                  <span className="text-primary-300 text-sm font-medium tracking-wide">
                    {slide.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="#booking"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-primary-600/50 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Đặt Lịch Ngay</span>
                  </Link>

                  <Link
                    href="#services"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white/30 transition-all duration-300 hover:border-white/50"
                  >
                    <span>Xem Dịch Vụ</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'w-12 h-2 bg-primary-500'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce">
        <Link
          href="#about"
          className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span className="text-sm font-medium">Cuộn xuống</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
