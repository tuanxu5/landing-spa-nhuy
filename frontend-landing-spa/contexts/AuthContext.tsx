'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authApi } from '@/lib/api';
import { getSessionToken, getAdministrator, clearSession, setAdministrator } from '@/lib/auth';
import type { Administrator } from '@/types';

interface AuthContextType {
  administrator: Administrator | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [administrator, setAdministratorState] = useState<Administrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Validate session on mount and when pathname changes
  useEffect(() => {
    const validateSession = async () => {
      const token = getSessionToken();
      
      // If no token, clear state and redirect if on protected route
      if (!token) {
        setAdministratorState(null);
        setIsLoading(false);
        
        // Redirect to login if trying to access admin routes (except login page)
        if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        return;
      }

      try {
        // Validate session with backend
        const admin = await authApi.me();
        setAdministratorState(admin);
        setAdministrator(admin); // Update localStorage
        
        // If on login page and authenticated, redirect to admin dashboard
        if (pathname === '/admin/login') {
          router.push('/admin');
        }
      } catch (error) {
        // Session is invalid or expired
        clearSession();
        setAdministratorState(null);
        
        // Redirect to login if on protected route
        if (pathname?.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [pathname, router]);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout API fails, clear local session
      console.error('Logout error:', error);
    } finally {
      clearSession();
      setAdministratorState(null);
      router.push('/admin/login');
    }
  };

  const value = {
    administrator,
    isAuthenticated: !!administrator,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
