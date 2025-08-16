import React, { useState, useEffect } from 'react';
import { Card, List, message, Tag, Space } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blogs`);
      setBlogs(response.data);
    } catch (error) {
      message.error('Blog yazıları yüklenirken bir hata oluştu');
      console.error('Fetch blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Haberler</h1>
      
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 4,
        }}
        loading={loading}
        dataSource={blogs}
        renderItem={(blog) => (
          <List.Item>
            <Link to={`/blog/${blog._id}`}>
              <Card
                hoverable
                cover={
                  blog.image && (
                    <img
                      alt={blog.title}
                      src={blog.image}
                      className="h-48 w-full object-cover"
                    />
                  )
                }
              >
                <Card.Meta
                  title={blog.title}
                  description={
                    <div>
                      <p className="text-gray-600 line-clamp-2 mb-2">
                        {blog.content}
                      </p>
                      <Space>
                        {blog.tags?.map((tag, index) => (
                          <Tag key={index} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  }
                />
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Blogs; 