import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Hakkımızda</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ceyhun Uzun Mimarlık</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              20 yılı aşkın deneyimimizle, modern mimari tasarım ve sürdürülebilir yapı çözümleri 
              konusunda uzmanlaşmış bir mimarlık firmasıyız. Müşterilerimizin hayallerini gerçeğe 
              dönüştürürken, çevreye duyarlı ve fonksiyonel tasarımlar yaratmayı hedefliyoruz.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Misyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">
              Yaşam alanlarını estetik, fonksiyonel ve sürdürülebilir bir şekilde tasarlayarak, 
              insanların yaşam kalitesini artırmak ve çevreye katkıda bulunmak.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Vizyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">
              Mimari tasarım alanında yenilikçi yaklaşımlarla öncü olmak ve her projede 
              mükemmelliği hedefleyerek sektörde güvenilir bir marka haline gelmek.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Değerlerimiz</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Yaratıcılık ve yenilikçilik</li>
              <li>Kalite ve mükemmellik</li>
              <li>Müşteri memnuniyeti</li>
              <li>Sürdürülebilirlik</li>
              <li>Profesyonellik ve güvenilirlik</li>
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Hizmetlerimiz</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Konut Tasarımı</h4>
                <p className="text-gray-600 text-sm">
                  Modern ve fonksiyonel konut tasarımları ile yaşam alanlarınızı optimize ediyoruz.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Ticari Projeler</h4>
                <p className="text-gray-600 text-sm">
                  Ofis, mağaza ve ticari yapılar için profesyonel tasarım çözümleri.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">İç Mekan Tasarımı</h4>
                <p className="text-gray-600 text-sm">
                  Mekanların ruhunu yansıtan özgün iç mekan tasarımları.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Proje Yönetimi</h4>
                <p className="text-gray-600 text-sm">
                  Projelerin başından sonuna kadar profesyonel yönetim hizmeti.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">İletişim</h3>
            <p className="text-gray-600 mb-4">
              Projeleriniz hakkında detaylı bilgi almak ve görüşmek için bizimle iletişime geçebilirsiniz.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">Adres:</strong><br />
                <span className="text-gray-600">Örnek Mahallesi, Örnek Sokak No:123<br />
                İstanbul, Türkiye</span>
              </div>
              <div>
                <strong className="text-gray-700">İletişim:</strong><br />
                <span className="text-gray-600">
                  Tel: +90 (212) 123 45 67<br />
                  E-posta: info@ceyhunuzunmimarlik.com
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