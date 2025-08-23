import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 py-8 mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Sol: Logo ve İsim */}
        <div className="flex items-center gap-3 justify-start w-full">
          <img src="/logoo.jpg" alt="Ceyhun Uzun Logo" className="w-12 h-12 rounded-full object-cover border border-gray-700 bg-white" />
          <span className="text-lg font-semibold tracking-wide">Ceyhun Uzun</span>
        </div>
        {/* Orta: Telif */}
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium">© {new Date().getFullYear()} Omer Kasapoglu</span>
          <span className="text-xs text-gray-400 mt-1">Tüm hakları saklıdır.</span>
        </div>
        {/* Sağ: Adres ve Telefonlar */}
        <div className="flex flex-col items-end gap-2 w-full">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-sm text-right">Kabe-i Mescid, Gaziosmanpaşa Blv. No:166 D:2</span>
          </div>
          <span className="text-sm text-right">60010 Tokat Merkez/Tokat</span>
          <div className="flex items-center gap-2 mt-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span className="text-sm">+90 (531) 654 75 60</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span className="text-sm">+90 (507) 821 93 60</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
