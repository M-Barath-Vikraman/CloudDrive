import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  const { isAuthenticated } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Guard routing - redirect to login if user session is not simulated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
      <Navbar isDashboard={true} onToggleMobileSidebar={toggleMobileSidebar} />

      <div className="dashboard-container">
        {/* Left Navigation Sidebar */}
        <Sidebar isOpen={mobileSidebarOpen} onCloseMobileSidebar={closeMobileSidebar} />

        {/* Backdrop for mobile drawer */}
        {mobileSidebarOpen && (
          <div 
            onClick={closeMobileSidebar}
            style={{
              position: 'fixed',
              top: 'var(--navbar-height)',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(2px)',
              zIndex: 90
            }}
          />
        )}

        {/* Dashboard Main Workspace */}
        <main className="dashboard-main flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
