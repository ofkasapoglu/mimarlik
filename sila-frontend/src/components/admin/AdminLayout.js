import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 