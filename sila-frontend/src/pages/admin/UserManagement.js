import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: '',
    images: [],
    demoUrl: '',
    githubUrl: '',
    featured: false
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log('Changing role for user:', userId, 'to:', newRole);
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('Role change response:', response.data);
      toast.success('Kullanıcı rolü güncellendi');
      fetchUsers();
    } catch (error) {
      console.error('Role change error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Rol güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Kullanıcı başarıyla silindi');
        fetchUsers();
      } catch (error) {
        console.error('Delete user error:', error);
        toast.error('Kullanıcı silinirken bir hata oluştu');
      }
    }
  };

  const handleAddPortfolio = (user) => {
    setSelectedUser(user);
    setShowPortfolioForm(true);
  };

  const handlePortfolioSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        title: portfolioData.title,
        description: portfolioData.description,
        technologies: portfolioData.technologies.split(',').map(tech => tech.trim()),
        category: portfolioData.category,
        images: portfolioData.images,
        demoUrl: portfolioData.demoUrl,
        githubUrl: portfolioData.githubUrl,
        featured: portfolioData.featured,
        author: selectedUser._id
      };

      console.log('Sending portfolio data:', formData);

      const response = await axios.post('http://localhost:5000/api/portfolio', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Server response:', response.data);

      toast.success('Portföy projesi başarıyla eklendi');
      setShowPortfolioForm(false);
      setPortfolioData({
        title: '',
        description: '',
        technologies: '',
        category: '',
        images: [],
        demoUrl: '',
        githubUrl: '',
        featured: false
      });
    } catch (error) {
      console.error('Portfolio error:', error.response?.data || error);
      toast.error('Portföy projesi eklenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Geri Dön
        </button>
      </div>

      {showPortfolioForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser.username} için Portföy Ekle
            </h2>
            <form onSubmit={handlePortfolioSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={portfolioData.title}
                  onChange={(e) => setPortfolioData({...portfolioData, title: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Açıklama
                </label>
                <textarea
                  value={portfolioData.description}
                  onChange={(e) => setPortfolioData({...portfolioData, description: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Teknolojiler (virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={portfolioData.technologies}
                  onChange={(e) => setPortfolioData({...portfolioData, technologies: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Kategori
                </label>
                <select
                  value={portfolioData.category}
                  onChange={(e) => {
                    console.log('Selected category:', e.target.value);
                    setPortfolioData({...portfolioData, category: e.target.value});
                  }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Web">Web Geliştirme</option>
                  <option value="Mobile">Mobil Uygulama</option>
                  <option value="Desktop">Masaüstü Uygulama</option>
                  <option value="AI">Yapay Zeka</option>
                  <option value="Other">Diğer</option>
                  <option value="All">Tümü</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={portfolioData.demoUrl}
                  onChange={(e) => setPortfolioData({...portfolioData, demoUrl: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={portfolioData.githubUrl}
                  onChange={(e) => setPortfolioData({...portfolioData, githubUrl: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={portfolioData.featured}
                    onChange={(e) => setPortfolioData({...portfolioData, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm font-bold">Öne Çıkan Proje</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPortfolioForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="text-sm text-gray-900 border rounded px-2 py-1"
                  >
                    <option value="user">Kullanıcı</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddPortfolio(user)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Portföy Ekle
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 