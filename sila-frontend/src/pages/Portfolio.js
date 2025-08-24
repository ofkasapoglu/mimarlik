import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';

  const categories = [
    { id: 'all', name: 'Tümü' },
  { id: 'Web', name: 'Kültür' },
  { id: 'Mobile', name: 'Eğitim' },
  { id: 'AI', name: 'Kentsel Tasarım' },
  { id: 'Desktop', name: 'Dini' },
  { id: 'Other', name: 'Diğer' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/portfolio`);
      console.log('Frontend received projects:', response.data);
      response.data.forEach(project => {
        console.log('Project in frontend:', {
          id: project._id,
          title: project.title,
          image: project.image,
          category: project.category
        });
      });
      setProjects(response.data);
    } catch (error) {
      console.error('Fetch projects error:', error);
      toast.error('Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projeler</h1>
        {isAdmin && (
          <Link
            to="/portfolio/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Yeni  Ekle
          </Link>
        )}
      </div>

      {/* Kategori Filtreleme */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Proje Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Link
            key={project._id}
            to={`/portfolio/${project._id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={project.image || 'https://via.placeholder.com/400x300?text=Proje+Görseli'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.featured && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm">
                  Öne Çıkan
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              {/* ...existing code... */}
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Bu kategoride henüz proje bulunmuyor.</p>
        </div>
      )}
    </div>
  );
};

export default Portfolio; 