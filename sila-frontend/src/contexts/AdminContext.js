import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(storedIsAdmin);
    setLoading(false);
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        setIsAdmin(false);
        localStorage.setItem('isAdmin', 'false');
        return false;
      }

      console.log('Checking admin status...');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/check-admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Admin check response:', response.data);
      const isAdminUser = response.data.isAdmin;
      setIsAdmin(isAdminUser);
      localStorage.setItem('isAdmin', isAdminUser.toString());
      return isAdminUser;
    } catch (error) {
      console.error('Admin check error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
      return false;
    }
  };

  const value = {
    isAdmin,
    loading,
    checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext; 