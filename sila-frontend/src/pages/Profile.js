import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        bio: response.data.bio || '',
        avatar: response.data.avatar || ''
      });
    } catch (error) {
      toast.error('Profil bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/api/auth/profile', formData);
      setProfile(response.data);
      setEditing(false);
      toast.success('Profil güncellendi');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-4 mb-8">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-500">
                {profile?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{profile?.username}</h1>
            <p className="text-gray-500">{profile?.email}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Hakkımda
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Profil Fotoğrafı URL
              </label>
              <input
                type="url"
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                İptal
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Hakkımda</h2>
              <p className="text-gray-700">{profile?.bio || 'Henüz bir bilgi girilmemiş.'}</p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Profili Düzenle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 