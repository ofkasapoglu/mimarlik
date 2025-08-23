import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const PortfolioDetail = () => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    category: '',
    technologies: '',
    image: '',
    images: [],
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null); // number | null
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditMode = id !== undefined;
  const isCreateMode = window.location.pathname.includes('/create');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [id]);

  // Klavye ile lightbox gezinme
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, project.images]);

  const goNext = () => {
    if (!Array.isArray(project.images) || project.images.length === 0 || lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      const next = (prev + 1) % project.images.length;
      return next;
    });
  };

  const goPrev = () => {
    if (!Array.isArray(project.images) || project.images.length === 0 || lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      const next = (prev - 1 + project.images.length) % project.images.length;
      return next;
    });
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio/${id}`);
      const projectData = response.data;
      
      // Teknolojileri string'e çevir
      const technologiesString = Array.isArray(projectData.technologies) 
        ? projectData.technologies.join(', ')
        : projectData.technologies;

      setProject({
        ...projectData,
        technologies: technologiesString
      });
      
      // Mevcut görsel varsa preview'a ekle
      if (projectData.image) {
        setImagePreview(projectData.image);
      }
    } catch (error) {
      toast.error('Proje yüklenirken bir hata oluştu');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        toast.error('Sadece resim dosyaları yükleyebilirsiniz');
        return;
      }

      setSelectedFile(file);

      // Preview oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Basit validasyonlar
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: Sadece resim dosyası yükleyebilirsiniz`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      e.target.value = null;
      return;
    }

    setGalleryUploading(true);
    try {
      const uploadedUrls = await Promise.all(validFiles.map((file) => uploadImage(file)));
      setProject((prev) => ({
        ...prev,
        images: [ ...(prev.images || []), ...uploadedUrls ]
      }));
      toast.success('Galeri görselleri eklendi');
    } catch (err) {
      toast.error(err.message || 'Galeri görselleri yüklenirken bir hata oluştu');
    } finally {
      setGalleryUploading(false);
      e.target.value = null;
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Uploading file:', file.name, file.size, file.type);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token bulunamadı');
      }
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 30000, // 30 saniye timeout
  // Progress bar kaldırıldı
      });
      console.log('Upload response:', response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Görsel yüklenirken bir hata oluştu');
      } else if (error.request) {
        console.error('No response received');
        throw new Error('Sunucuya bağlanılamadı');
      } else {
        throw new Error('Görsel yüklenirken bir hata oluştu');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error('Bu işlem için yetkiniz yok');
      return;
    }

    setLoading(true);

    try {
      if (isCreateMode && !selectedFile) {
        toast.error('Lütfen bir görsel dosyası seçin');
        return;
      }

      let imageUrl = project.image;
      if (selectedFile) {
  imageUrl = await uploadImage(selectedFile);
      }

      const formData = {
        ...project,
        image: imageUrl,
        technologies: project.technologies.split(',').map(tech => tech.trim()),
        images: project.images || []
      };

      if (isCreateMode) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Proje başarıyla oluşturuldu');
      } else if (isEditMode) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Proje başarıyla güncellendi');
      }

      navigate('/admin/portfolio');
    } catch (error) {
      console.error('Portfolio error:', error);
      toast.error(error.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) {
      toast.error('Bu işlem için yetkiniz yok');
      return;
    }

    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Proje başarıyla silindi');
        navigate('/admin/portfolio');
      } catch (error) {
        toast.error('Proje silinirken bir hata oluştu');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Normal kullanıcılar için sadece görüntüleme modu
  if (!isAdmin && (isEditMode || isCreateMode)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {project.image && (
              <div className="mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full max-h-[480px] object-cover rounded-lg shadow"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold mb-6">Proje Detayları</h1>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p className="text-gray-600">{project.category}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Açıklama</h3>
                <p className="text-gray-800 whitespace-pre-line leading-7">{project.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Kullanılan Teknolojiler</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(project.technologies) ? project.technologies.map((tech, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  )) : null}
                </div>
              </div>

              <div className="flex gap-4">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                  >
                    GitHub
                  </a>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/portfolio')}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Geri Dön
                </button>
              </div>

              {Array.isArray(project.images) && project.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Galeri</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {project.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="relative group"
                        onClick={() => setLightboxIndex(idx)}
                        title="Büyüt"
                      >
                        <img
                          src={imgUrl}
                          alt={`Galeri ${idx + 1}`}
                          className="w-full h-28 object-cover rounded-md border border-gray-200 shadow-sm group-hover:opacity-90"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Lightbox Overlay (ziyaretçi) */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              className="absolute left-4 text-white text-3xl p-2 bg-black bg-opacity-40 rounded"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Önceki"
            >
              ‹
            </button>
            <img
              src={project.images[lightboxIndex]}
              alt="Büyük Görsel"
              className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              className="absolute right-4 text-white text-3xl p-2 bg-black bg-opacity-40 rounded"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Sonraki"
            >
              ›
            </button>
          </div>
        )}
      </div>
    );
  }

  // Admin için düzenleme/ekleme formu
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            {isCreateMode ? 'Yeni Proje Ekle' : isEditMode ? 'Projeyi Düzenle' : project.title}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Başlık</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({...project, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Görsel Yükleme (sadece dosya) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kapak Görseli</label>
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Maksimum dosya boyutu: 5MB. Desteklenen formatlar: JPG, PNG, GIF
                </p>
              </div>
              {/* Görsel Önizleme */}
              {imagePreview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Önizleme</label>
                  <div className="relative w-48 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                      Görsel yüklenemedi
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Galeri Yükleme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Galeri Görselleri</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryFilesChange}
                disabled={galleryUploading}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">Birden fazla görsel seçebilirsiniz (max ~5MB/ görsel)</p>

              {Array.isArray(project.images) && project.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {project.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={imgUrl}
                        alt={`Galeri ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-md border border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setProject((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx)
                        }))}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                        title="Kaldır"
                      >
                        Kaldır
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Açıklama</label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({...project, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                value={project.category}
                onChange={(e) => setProject({...project, category: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Seçiniz</option>
                <option value="Web">Kültür</option>
                <option value="Mobile">Eğitim</option>
                <option value="Desktop">Kentsel Tasarım</option>
                <option value="AI">Dini</option>
                <option value="Other">Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Teknolojiler (virgülle ayırın)</label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => setProject({...project, technologies: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={project.featured}
                onChange={(e) => setProject({...project, featured: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">Öne Çıkan Proje</label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/portfolio')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                İptal
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Kaydediliyor...' : isCreateMode ? 'Oluştur' : 'Güncelle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    {lightboxIndex !== null && (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={() => setLightboxIndex(null)}
      >
        <button
          type="button"
          className="absolute left-4 text-white text-3xl p-2 bg-black bg-opacity-40 rounded"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          aria-label="Önceki"
        >
          ‹
        </button>
        <img
          src={project.images[lightboxIndex]}
          alt="Büyük Görsel"
          className="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          type="button"
          className="absolute right-4 text-white text-3xl p-2 bg-black bg-opacity-40 rounded"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          aria-label="Sonraki"
        >
          ›
        </button>
      </div>
    )}
  </>
  );
};

export default PortfolioDetail; 