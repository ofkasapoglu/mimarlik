import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Button, Form, Input } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const CreateBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/blogs', {
        title: values.title,
        content: values.content,
        image: values.image
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Blog yazısı başarıyla oluşturuldu!');
      navigate(`/blog/${response.data._id}`);
    } catch (error) {
      message.error(error.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Yeni Haber Yazısı</h1>
      </div>

      <Form
        layout="vertical"
        onFinish={onFinish}
        className="max-w-4xl"
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

        <Form.Item>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => navigate(-1)}>
              İptal
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Yayınla
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBlog; 