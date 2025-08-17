import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [blogsRes, projectsRes] = await Promise.all([
        axios.get('https://mimarlik-1.onrender.com/api/blogs'),
        axios.get('https://mimarlik-1.onrender.com/api/portfolio'),
      ]);

      setBlogs(blogsRes.data.slice(0, 3));
      setProjects(projectsRes.data.slice(0, 3));
    } catch (error) {
      console.error(error);
      toast.error('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false); // Loading her durumda kapanacak
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Profil'; }}
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
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Proje+Görseli'; }}
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

      {/* Blog Bölümü */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Son Haberler</h2>
          <Link
            to="/blogs"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Tüm Yazıları Gör →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog.image && (
                <img
                  src={blog.image || 'https://via.placeholder.com/400x300?text=Blog+Görseli'}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Görseli'; }}
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-gray-900 hover:text-blue-600"
                  >
                    {blog.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{blog.author.username}</span>
                  <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
