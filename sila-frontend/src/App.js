import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BlogManagement from './pages/admin/BlogManagement';
import CommentManagement from './pages/admin/CommentManagement';
import PortfolioManagement from './pages/admin/PortfolioManagement';
import PortfolioDetail from './pages/PortfolioDetail';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import Blogs from './pages/Blogs';
import About from './pages/About';
import Contact from './pages/Contact';
import AboutManagement from './pages/admin/AboutManagement';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                {/* Normal kullanıcı giriş/kayıt kaldırıldı */}
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/create-blog" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                <Route path="/portfolio/create" element={<PrivateRoute><PortfolioDetail /></PrivateRoute>} />
                <Route path="/portfolio/edit/:id" element={<PrivateRoute><PortfolioDetail /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin route'ları */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/blogs" element={<AdminRoute><BlogManagement /></AdminRoute>} />
                <Route path="/admin/comments" element={<AdminRoute><CommentManagement /></AdminRoute>} />
                <Route path="/admin/portfolio" element={<AdminRoute><PortfolioManagement /></AdminRoute>} />
                <Route path="/admin/about" element={<AdminRoute><AboutManagement /></AdminRoute>} />
              </Routes>
              <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
