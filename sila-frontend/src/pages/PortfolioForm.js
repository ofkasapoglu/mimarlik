import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const PortfolioForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    category: '',
    images: '',
    demoUrl: '',
    githubUrl: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const categories = [
    { value: 'Web', label: 'Web Geliştirme' },
    { value: 'Mobile', label: 'Mobil Uygulama' },
    { value: 'Desktop', label: 'Masaüstü Uygulama' },
    { value: 'AI', label: 'Yapay Zeka' },
    { value: 'Other', label: 'Diğer' }
  ];

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      toast.error('Bu sayfaya erişim yetkiniz yok');
      navigate('/portfolio');
      return;
    }

    if (isEditMode) {
      fetchProject();
    }
  }, [id, navigate]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/portfolio/${id}`);
      const project = response.data;
      setFormData({
        ...project,
        technologies: project.technologies.join(', '),
        images: project.images.join('\n')
      });
    } catch (error) {
      toast.error('Proje yüklenirken bir hata oluştu');
      navigate('/portfolio');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim()),
        images: formData.images.split('\n').map(url => url.trim()).filter(url => url)
      };

      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/portfolio/${id}`,
          projectData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Proje başarıyla güncellendi');
      } else {
        await axios.post(
          'http://localhost:5000/api/portfolio',
          projectData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        toast.success('Proje başarıyla oluşturuldu');
      }
      navigate('/portfolio');
    } catch (error) {
      console.error('Portfolio error:', error.response?.data || error);
      toast.error(isEditMode ? 'Proje güncellenirken bir hata oluştu' : 'Proje oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEditMode ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proje Başlığı
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Teknolojiler */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teknolojiler (virgülle ayırın)
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Kategori Seçin</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Görseller */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Görsel URL'leri (her satıra bir URL)
            </label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Demo URL
            </label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Öne Çıkan */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Öne Çıkan Proje
            </label>
          </div>

          {/* Butonlar */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : isEditMode ? 'Güncelle' : 'Oluştur'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/portfolio')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm; 