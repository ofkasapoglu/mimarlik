import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('https://mimarlik-1.onrender.com/api/portfolio');
      // Son 3 projeyi al
      const latestProjects = response.data.slice(0, 3);
      setProjects(latestProjects);
    } catch (error) {
      toast.error('Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hakkımda Bölümü */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Hakkımda</h2>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src="/logoo.jpg"
                alt="Profil"
              />
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Merhaba, Ben Ceyhun Uzun</h2>
              <p className="text-gray-600 text-lg mb-4">
                Mimar olarak, estetik ve işlevselliği bir araya getirerek yaşam alanlarını dönüştürüyorum.
                Tasarımlarımda, kullanıcı deneyimini ön planda tutarken, çağdaş mimari yaklaşımları sürdürülebilir
                çözümlerle harmanlıyorum. Konut, ofis, ticari yapı ve iç mekan projelerinde,
                özgünlük ve detaylara verdiğim önemle fark yaratmayı hedefliyorum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portföy Bölümü */}
      <section className="mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Son Projeler</h2>
          <Link
            to="/portfolio"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Tüm Projeleri Gör →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
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
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;