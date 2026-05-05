/**
 * Footer Component
 * 
 * Displays spa contact information and social links.
 * Styled with Tailwind CSS for responsive design.
 * 
 * Requirements: 6.1, 6.3, 6.5, 7.1
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Spa Information */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Spa Nhuy</h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Điểm đến thư giãn và làm đẹp của bạn. Trải nghiệm dịch vụ spa cao cấp trong không gian yên tĩnh và sang trọng.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110 cursor-pointer"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110 cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 hover:scale-110 cursor-pointer"
                aria-label="Zalo"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm.5 14.969l-3.076-3.273-6.004 3.273L9.924 8.03l3.152 3.273L19.076 8.03 12.5 14.969z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Liên Hệ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start justify-center md:justify-start group">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <svg
                    className="w-5 h-5 text-primary-400 group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 text-left">
                  <p className="text-gray-400 leading-relaxed">
                    123 Đường Làm Đẹp<br />
                    Quận Spa, TP.HCM
                  </p>
                </div>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <svg
                    className="w-5 h-5 text-primary-400 group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <a href="tel:+84912345678" className="ml-3 text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">
                  +84 912 345 678
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start group">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <svg
                    className="w-5 h-5 text-primary-400 group-hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <a href="mailto:info@spanhuy.com" className="ml-3 text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">
                  info@spanhuy.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-6 flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Giờ Mở Cửa
            </h4>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-gray-400 max-w-xs mx-auto md:mx-0 bg-gray-800/50 rounded-lg px-4 py-2">
                <span className="font-medium">Thứ 2 - Thứ 6:</span>
                <span className="text-primary-400">9:00 - 20:00</span>
              </li>
              <li className="flex justify-between items-center text-gray-400 max-w-xs mx-auto md:mx-0 bg-gray-800/50 rounded-lg px-4 py-2">
                <span className="font-medium">Thứ 7:</span>
                <span className="text-primary-400">10:00 - 18:00</span>
              </li>
              <li className="flex justify-between items-center text-gray-400 max-w-xs mx-auto md:mx-0 bg-gray-800/50 rounded-lg px-4 py-2">
                <span className="font-medium">Chủ Nhật:</span>
                <span className="text-primary-400">10:00 - 17:00</span>
              </li>
            </ul>

            {/* Quick Links */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-white mb-4">Liên Kết Nhanh</h4>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#services" className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">
                  Dịch Vụ
                </a>
                <span className="text-gray-600">•</span>
                <a href="#about" className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">
                  Về Chúng Tôi
                </a>
                <span className="text-gray-600">•</span>
                <a href="#booking" className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">
                  Đặt Lịch
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Spa Nhuy. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">
                Chính Sách Bảo Mật
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors cursor-pointer">
                Điều Khoản Dịch Vụ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
