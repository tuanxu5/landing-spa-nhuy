'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/admin/Navigation';
import TopBar from '@/components/admin/TopBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop mặc định mở
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Không hiển thị navigation cho trang login
  const isLoginPage = pathname === '/admin/login';

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Mobile mặc định đóng sidebar
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    // Chỉ đóng sidebar trên mobile khi click vào link
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  if (isLoginPage) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/30">
        <Navigation isOpen={sidebarOpen} onClose={closeSidebar} />
        <TopBar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        {/* Main content area - điều chỉnh margin dựa trên sidebar state */}
        <main 
          className={`pt-20 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
          }`}
        >
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
