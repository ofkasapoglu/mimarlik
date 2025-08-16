import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Popconfirm, Space, Tag, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/blogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(response.data);
    } catch (error) {
      message.error('Blog yazıları yüklenirken bir hata oluştu');
      console.error('Fetch blogs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/blogs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    message.success('Blog yazısı başarıyla silindi');
    fetchBlogs();
  } catch (error) {
    message.error('Blog yazısı silinirken bir hata oluştu');
    console.error('Delete blog error:', error);
  }
};

  const showBlogDetails = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/blogs`, {
        title: values.title,
        content: values.content,
        image: values.image
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      message.success('Blog yazısı başarıyla oluşturuldu');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchBlogs();
    } catch (error) {
      message.error(error.response?.data?.message || 'Blog yazısı oluşturulurken bir hata oluştu');
    }
  };

  const columns = [
    {
      title: 'Başlık',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Yazar',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author?.username || 'Bilinmiyor'
    },
    {
      title: 'Oluşturulma Tarihi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('tr-TR')
    },
    {
      title: 'Etiketler',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => (
        <Space>
          {tags?.map((tag, index) => (
            <Tag key={index} color="blue">{tag}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showBlogDetails(record)}
            type="primary"
            ghost
          >
            Görüntüle
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/blogs/edit/${record._id}`)}
            type="primary"
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Bu blog yazısını silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
            >
              Sil
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Haber Yönetimi</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalVisible(true)}
        >
          Yeni Haber Yazısı
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={blogs}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} blog yazısı`
        }}
      />

      <Modal
        title="Blog Detayları"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedBlog && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Başlık</h3>
              <p>{selectedBlog.title}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">İçerik</h3>
              <p className="whitespace-pre-wrap">{selectedBlog.content}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Etiketler</h3>
              <Space>
                {selectedBlog.tags?.map((tag, index) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </Space>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Yazar</h3>
              <p>{selectedBlog.author?.username}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Oluşturulma Tarihi</h3>
              <p>{new Date(selectedBlog.createdAt).toLocaleString('tr-TR')}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Yeni Haber Yazısı"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
        >
          <Form.Item
            label="Başlık"
            name="title"
            rules={[{ required: true, message: 'Lütfen başlık giriniz' }]}
          >
            <Input placeholder="Blog yazısının başlığını giriniz" />
          </Form.Item>

          <Form.Item
            label="İçerik"
            name="content"
            rules={[{ required: true, message: 'Lütfen içerik giriniz' }]}
          >
            <TextArea
              rows={10}
              placeholder="Blog yazısının içeriğini giriniz"
            />
          </Form.Item>

          <Form.Item
            label="Kapak Görseli URL"
            name="image"
            rules={[{ type: 'url', message: 'Lütfen geçerli bir URL giriniz' }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-4">
              <Button onClick={() => {
                setIsCreateModalVisible(false);
                createForm.resetFields();
              }}>
                İptal
              </Button>
              <Button type="primary" htmlType="submit">
                Yayınla
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement; 