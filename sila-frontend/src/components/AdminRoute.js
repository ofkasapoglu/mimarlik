import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdmin();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 