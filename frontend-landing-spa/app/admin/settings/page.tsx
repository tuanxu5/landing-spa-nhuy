'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import PasswordChange from '@/components/admin/PasswordChange';
import { authApi } from '@/lib/api';
import type { Administrator, ApiError } from '@/types';

export default function SettingsPage() {
  const { administrator: authAdmin } = useAuth();
  const [administrator, setAdministrator] = useState<Administrator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdministrator = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await authApi.me();
        setAdministrator(data);
      } catch (err) {
        const apiError = err as ApiError;
        console.error('Failed to fetch administrator info:', apiError);
        setError(apiError.message || 'Failed to load administrator information');
      } finally {
        setLoading(false);
      }
    };

    fetchAdministrator();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Administrator Information Section */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Administrator Information</h2>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-64"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-600 mr-2">✕</span>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              ) : administrator ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <p className="text-base text-gray-900">{administrator.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-base text-gray-900">{administrator.email}</p>
                  </div>
                  {administrator.lastLoginAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Login
                      </label>
                      <p className="text-base text-gray-900">
                        {new Date(administrator.lastLoginAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Password Change Section */}
          <div>
            <PasswordChange />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
