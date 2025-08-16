import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    setLoading(false);
  }, [isAdmin, navigate]);

  const adminModules = [
    {
      title: 'Proje Yönetimi',
      description: 'Portföy projelerini ekle, düzenle ve yönet',
      icon: '🏗️',
      path: '/admin/portfolio',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Haber Yönetimi',
      description: 'Blog yazılarını ve haberleri yönet',
      icon: '📰',
      path: '/admin/blogs',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Hakkımızda Yönetimi',
      description: 'Şirket bilgilerini ve hakkımızda sayfasını düzenle',
      icon: 'ℹ️',
      path: '/admin/about',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Paneli</h1>
          <p className="text-gray-600 mt-2">Hoş geldiniz, {user?.username}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Son güncelleme</p>
          <p className="text-sm font-medium">{new Date().toLocaleString('tr-TR')}</p>
        </div>
      </div>

      {/* Site Yönetimi */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Site Yönetimi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <div
              key={index}
              onClick={() => navigate(module.path)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{module.icon}</span>
                <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              <button className={`w-full text-white py-2 px-4 rounded-md transition-colors ${module.color}`}>
                Yönet
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 