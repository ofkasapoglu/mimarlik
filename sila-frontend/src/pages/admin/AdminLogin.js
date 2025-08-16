import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { checkAdminStatus } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Önce normal giriş yap
      const user = await login(email, password);
      console.log('Login başarılı:', user);

      // Admin kontrolü yap
      const isAdmin = await checkAdminStatus();
      console.log('Admin kontrolü sonucu:', isAdmin);

      if (isAdmin) {
        toast.success('Admin girişi başarılı!');
        navigate('/admin');
      } else {
        // Admin değilse çıkış yap
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        toast.error('Bu hesap admin yetkisine sahip değil!');
      }
    } catch (error) {
      console.error('Login hatası:', error);
      toast.error(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Girişi</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Şifre
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin; 