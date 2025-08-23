import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AboutManagement = () => {
  const [aboutData, setAboutData] = useState({
    companyName: 'Ceyhun Uzun Mimarlık',
    description: '',
    mission: '',
    vision: '',
    values: [],
    services: [],
    contactInfo: {
      address: '',
      phone: '',
      email: '',
      workingHours: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newService, setNewService] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const token = localStorage.getItem('token');
  const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/about`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        // contactInfo eksikse varsayılan boş nesne ata
        setAboutData({
          ...response.data,
          contactInfo: response.data.contactInfo || {
            address: '',
            phone: '',
            email: '',
            workingHours: ''
          }
        });
      }
    } catch (error) {
      console.error('Fetch about data error:', error);
      // Eğer veri yoksa varsayılan verileri kullan
      setAboutData({
        companyName: 'Ceyhun Uzun Mimarlık',
        description: '20 yılı aşkın deneyimimizle, modern mimari tasarım ve sürdürülebilir yapı çözümleri konusunda uzmanlaşmış bir mimarlık firmasıyız.',
        mission: 'Yaşam alanlarını estetik, fonksiyonel ve sürdürülebilir bir şekilde tasarlayarak, insanların yaşam kalitesini artırmak ve çevreye katkıda bulunmak.',
        vision: 'Mimari tasarım alanında yenilikçi yaklaşımlarla öncü olmak ve her projede mükemmelliği hedefleyerek sektörde güvenilir bir marka haline gelmek.',
        values: ['Yaratıcılık ve yenilikçilik', 'Kalite ve mükemmellik', 'Müşteri memnuniyeti', 'Sürdürülebilirlik', 'Profesyonellik ve güvenilirlik'],
        services: [
          { title: 'Konut Tasarımı', description: 'Modern ve fonksiyonel konut tasarımları ile yaşam alanlarınızı optimize ediyoruz.' },
          { title: 'Ticari Projeler', description: 'Ofis, mağaza ve ticari yapılar için profesyonel tasarım çözümleri.' },
          { title: 'İç Mekan Tasarımı', description: 'Mekanların ruhunu yansıtan özgün iç mekan tasarımları.' },
          { title: 'Proje Yönetimi', description: 'Projelerin başından sonuna kadar profesyonel yönetim hizmeti.' }
        ],
        contactInfo: {
          address: 'Örnek Mahallesi, Örnek Sokak No:123\nBeşiktaş, İstanbul, Türkiye',
          phone: '+90 (212) 123 45 67\n+90 (532) 123 45 67',
          email: 'info@ceyhunuzunmimarlik.com\nproje@ceyhunuzunmimarlik.com',
          workingHours: 'Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 09:00 - 14:00\nPazar: Kapalı'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
  await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/about`, aboutData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Hakkımızda sayfası başarıyla güncellendi');
    } catch (error) {
      console.error('Save about data error:', error);
      toast.error('Güncelleme sırasında bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const addValue = () => {
    if (newValue.trim()) {
      setAboutData(prev => ({
        ...prev,
        values: [...prev.values, newValue.trim()]
      }));
      setNewValue('');
    }
  };

  const removeValue = (index) => {
    setAboutData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (newService.title.trim() && newService.description.trim()) {
      setAboutData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService }]
      }));
      setNewService({ title: '', description: '' });
    }
  };

  const removeService = (index) => {
    setAboutData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hakkımızda Sayfası Yönetimi</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sol Kolon */}
        <div className="space-y-6">
          {/* Şirket Bilgileri */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Şirket Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Adı
                </label>
                <input
                  type="text"
                  value={aboutData.companyName}
                  onChange={(e) => setAboutData(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şirket Açıklaması
                </label>
                <textarea
                  value={aboutData.description}
                  onChange={(e) => setAboutData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Misyon ve Vizyon */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Misyon ve Vizyon</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Misyonumuz
                </label>
                <textarea
                  value={aboutData.mission}
                  onChange={(e) => setAboutData(prev => ({ ...prev, mission: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vizyonumuz
                </label>
                <textarea
                  value={aboutData.vision}
                  onChange={(e) => setAboutData(prev => ({ ...prev, vision: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Değerlerimiz */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Değerlerimiz</h2>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Yeni değer ekle"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && addValue()}
                />
                <button
                  onClick={addValue}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Ekle
                </button>
              </div>

              <div className="space-y-2">
                {aboutData.values.map((value, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span>{value}</span>
                    <button
                      onClick={() => removeValue(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-6">
          {/* Hizmetlerimiz */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Hizmetlerimiz</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Hizmet başlığı"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Hizmet açıklaması"
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addService}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Hizmet Ekle
                </button>
              </div>

              <div className="space-y-3">
                {aboutData.services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{service.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                      </div>
                      <button
                        onClick={() => removeService(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">İletişim Bilgileri</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres
                </label>
                <textarea
                  value={aboutData.contactInfo.address}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, address: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <textarea
                  value={aboutData.contactInfo.phone}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <textarea
                  value={aboutData.contactInfo.email}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, email: e.target.value }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çalışma Saatleri
                </label>
                <textarea
                  value={aboutData.contactInfo.workingHours}
                  onChange={(e) => setAboutData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, workingHours: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManagement; 