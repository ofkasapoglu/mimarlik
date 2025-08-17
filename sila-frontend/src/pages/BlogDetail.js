import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      toast.error('Blog yazısı yüklenirken bir hata oluştu');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}/like`);
      setBlog(response.data);
    } catch (error) {
      toast.error('Beğeni işlemi başarısız oldu');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    try {
      console.log('Yorum gönderiliyor:', { blogId: id, text: comment });
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}/comments`, {
        text: comment
      });
      console.log('Yorum başarıyla eklendi:', response.data);
      setBlog(response.data);
      setComment('');
      toast.success('Yorumunuz eklendi');
    } catch (error) {
      console.error('Yorum ekleme hatası:', error.response?.data || error.message);
      toast.error('Yorum eklenirken bir hata oluştu');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}`);
      toast.success('Blog yazısı silindi');
      navigate('/');
    } catch (error) {
      toast.error('Blog yazısı silinirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const isAuthor = user && blog.author._id === user.id;

  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center justify-between text-gray-500 mb-8">
            <div className="flex items-center">
              <span className="mr-4">{blog.author.username}</span>
              <span>
                {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
            {isAuthor && (
              <div className="space-x-4">
                <button
                  onClick={() => navigate(`/edit-blog/${id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Düzenle
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800"
                >
                  Sil
                </button>
              </div>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

         


            <div className="space-y-4">
              {blog.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{comment.user.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        
      </article>
    </div>
  );
};

export default BlogDetail; 