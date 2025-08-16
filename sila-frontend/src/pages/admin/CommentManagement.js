import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Popconfirm, Space, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Comments response:', response.data);
      setComments(response.data);
    } catch (error) {
      message.error('Yorumlar yüklenirken bir hata oluştu');
      console.error('Fetch comments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/admin/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Yorum başarıyla silindi');
      fetchComments();
    } catch (error) {
      message.error('Yorum silinirken bir hata oluştu');
      console.error('Delete comment error:', error);
    }
  };

  const showCommentDetails = (comment) => {
    setSelectedComment(comment);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Yorum',
      dataIndex: 'content',
      key: 'content',
      render: (text) => <span className="line-clamp-2">{text}</span>
    },
    {
      title: 'Yazar',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author?.username || 'Bilinmiyor'
    },
    {
      title: 'Blog Yazısı',
      dataIndex: 'post',
      key: 'post',
      render: (post) => post?.title || 'Bilinmiyor'
    },
    {
      title: 'Tarih',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('tr-TR')
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showCommentDetails(record)}
            type="primary"
            ghost
          >
            Görüntüle
          </Button>
          <Popconfirm
            title="Bu yorumu silmek istediğinizden emin misiniz?"
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
        <h1 className="text-2xl font-bold">Yorum Yönetimi</h1>
      </div>

      <Table
        columns={columns}
        dataSource={comments}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Toplam ${total} yorum`
        }}
      />

      <Modal
        title="Yorum Detayları"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedComment && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Yorum</h3>
              <p className="whitespace-pre-wrap">{selectedComment.content}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Yazar</h3>
              <p>{selectedComment.author?.username}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Blog Yazısı</h3>
              <p>{selectedComment.post?.title}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Tarih</h3>
              <p>{new Date(selectedComment.createdAt).toLocaleString('tr-TR')}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommentManagement; 