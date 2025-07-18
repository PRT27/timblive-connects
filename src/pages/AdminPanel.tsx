
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminUserManager from '@/components/AdminUserManager';
import { Shield } from 'lucide-react';

const AdminPanel = () => {
  const { user, isAuthenticated } = useAuth();

  // For now, allow access to demonstrate functionality
  // In production, you would check for admin role
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">User management and system administration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <AdminUserManager />
      </div>
    </div>
  );
};

export default AdminPanel;
