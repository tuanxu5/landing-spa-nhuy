'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const pathname = usePathname();
  const { administrator, logout } = useAuth();

  const navigation = [
    { 
      name: 'Tổng quan', 
      href: '/admin', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Đặt lịch', 
      href: '/admin/bookings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'Dịch vụ', 
      href: '/admin/services', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    { 
      name: 'Bài viết', 
      href: '/admin/posts', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    { 
      name: 'Cài đặt', 
      href: '/admin/settings', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay - chỉ hiện trên mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar navigation - Full width trên mobile, mini/full trên desktop */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 shadow-xl transition-all duration-300 ease-in-out
          ${isOpen ? 'w-72 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className={`flex items-center justify-center px-6 py-5 border-b border-gray-200 ${!isOpen && 'lg:px-4'}`}>
            {isOpen ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Spa Admin</h1>
                </div>
                <button
                  onClick={onClose}
                  className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  aria-label="Đóng menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex w-full justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* User info - ẩn hoàn toàn */}

          {/* Navigation links */}
          <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${isOpen ? 'px-4' : 'px-2 lg:px-2'}`}>
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center rounded-xl transition-all duration-200
                      ${isOpen ? 'gap-3 px-4 py-3.5' : 'justify-center p-3 lg:p-3'}
                      ${
                        active
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className={active ? 'text-white' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    {isOpen && (
                      <>
                        <span className="text-sm font-semibold">{item.name}</span>
                        {active && (
                          <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </>
                    )}
                  </Link>
                  
                  {/* Tooltip khi sidebar đóng */}
                  {!isOpen && (
                    <div className="hidden lg:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className={`py-4 border-t border-gray-200 ${isOpen ? 'px-4' : 'px-2'}`}>
            <div className="relative group">
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className={`
                  w-full flex items-center text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200
                  ${isOpen ? 'gap-3 px-4 py-3.5' : 'justify-center p-3'}
                `}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {isOpen && <span>Đăng xuất</span>}
              </button>
              
              {/* Tooltip cho logout */}
              {!isOpen && (
                <div className="hidden lg:block absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Đăng xuất
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
