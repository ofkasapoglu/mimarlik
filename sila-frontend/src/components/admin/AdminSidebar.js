import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="mt-4">
        <Link
          to="/admin/dashboard"
          className={`flex items-center px-4 py-2 ${
            isActive('/admin/dashboard')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mx-4">Dashboard</span>
        </Link>
        <Link
          to="/admin/users"
          className={`flex items-center px-4 py-2 ${
            isActive('/admin/users')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mx-4">Kullanıcılar</span>
        </Link>
        <Link
          to="/admin/blogs"
          className={`flex items-center px-4 py-2 ${
            isActive('/admin/blogs')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mx-4">Blog Yazıları</span>
        </Link>
        <Link
          to="/admin/portfolio"
          className={`flex items-center px-4 py-2 ${
            isActive('/admin/portfolio')
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mx-4">Portföy</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar; 