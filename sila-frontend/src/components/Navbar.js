import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { to: '/portfolio', label: 'Projelerim' },
    { to: '/about', label: 'Hakkımızda' },
    { to: '/blogs', label: 'Haberler' },
    { to: '/contact', label: 'İletişim' }
  ];

  // Yol bilgisi
  const path = location.pathname;

  // Admin sayfalarında header'ı tamamen gizle; kullanıcı varsa sadece Çıkış butonu göster
  if (path.startsWith('/admin')) {
    if (user) {
      return (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors shadow-lg"
          >
            Çıkış Yap
          </button>
        </div>
      );
    }
    return null;
  }

  // Belirli sayfalarda header'ı tamamen gizle
  const shouldHideNavbar =
    path === '/create-blog' ||
    path === '/profile' ||
    path === '/portfolio/create' ||
    path.startsWith('/portfolio/edit');

  if (shouldHideNavbar) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Ceyhun Uzun Mimarlık
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Ana Navigasyon Linkleri */}
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-gray-600 hover:text-gray-900 transition-colors ${
                    isActive(link.to) ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Admin menüsü kaldırıldı */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {/* Ana Navigasyon Linkleri */}
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.to) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin menüsü kaldırıldı (mobile) */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 