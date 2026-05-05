'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Navigation from '@/components/admin/Navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        {/* Main content area with left margin for sidebar on desktop */}
        <main className="lg:ml-64 pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
