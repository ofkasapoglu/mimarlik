import React, { useEffect, useState } from 'react';
import axios from 'axios';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/about`);
        setAbout(response.data);
      } catch (error) {
        setAbout(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Yükleniyor...</div>;
  }
  if (!about) {
    return <div className="text-center py-10 text-red-500">Hakkımızda verisi bulunamadı.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Hakkımızda</h1>
        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">{about.companyName}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{about.description}</p>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Misyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">{about.mission}</p>
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Vizyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">{about.vision}</p>
          </div>
          {about.values && about.values.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Değerlerimiz</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {about.values.map((v, i) => <li key={i}>{v}</li>)}
              </ul>
            </div>
          )}
          {about.services && about.services.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Hizmetlerimiz</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {about.services.map((s, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">{s.title}</h4>
                    <p className="text-gray-600 text-sm">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">İletişim</h3>
            <p className="text-gray-600 mb-4">
              Projeleriniz hakkında detaylı bilgi almak ve görüşmek için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">Adres:</strong><br />
                <span className="text-gray-600">{about.contactInfo?.address || ''}</span>
              </div>
              <div>
                <strong className="text-gray-700">İletişim:</strong><br />
                <span className="text-gray-600">
                  Tel: {about.contactInfo?.phone || ''}<br />
                  E-posta: {about.contactInfo?.email || ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 