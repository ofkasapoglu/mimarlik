import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
    fetchProjects();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      // Son 3 blogu al
      const latestBlogs = response.data.slice(0, 3);
      setBlogs(latestBlogs);
    } catch (error) {
      toast.error('Blog yazıları yüklenirken bir hata oluştu');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/portfolio');
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
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
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
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                  <span className="flex items-center text-gray-500">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {blog.likes.length}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    {blog.comments.length}
                  </span>
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