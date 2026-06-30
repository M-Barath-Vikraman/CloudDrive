import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiCloud, FiBell, FiLogOut, FiMoon, FiSun, FiMenu } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import SearchBar from './SearchBar';
import Button from './Button';

const Navbar = ({ isDashboard = false, onToggleMobileSidebar }) => {
  const { 
    user, 
    handleLogout, 
    isDarkMode, 
    setIsDarkMode, 
    notificationsEnabled 
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);


  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 1. Dashboard Navbar Layout
  if (isDashboard) {
    return (
      <header className="navbar">
        <div className="flex align-center gap-2">
          {/* Mobile hamburger menu toggle */}
          {onToggleMobileSidebar && (
            <Button 
              variant="icon" 
              onClick={onToggleMobileSidebar} 
              className="mr-2"
              style={{ display: 'none', padding: '0.5rem' }} 
              id="sidebar-toggle-btn"
            >
              <FiMenu style={{ fontSize: '1.25rem' }} />
            </Button>
          )}
          
          <Link to="/dashboard" className="nav-brand">
            <FiCloud className="nav-brand-icon" />
            <span>CloudDrive</span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="nav-search flex-1">
          <SearchBar />
        </div>

        {/* Action controls */}
        <div className="nav-actions">
          {/* Dark Mode Toggle */}
          <Button 
            variant="icon" 
            onClick={toggleTheme} 
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <FiSun style={{ fontSize: '1.15rem' }} /> : <FiMoon style={{ fontSize: '1.15rem' }} />}
          </Button>

          {/* Notifications bell */}
          <div style={{ position: 'relative' }}>
            <Button 
              variant="icon" 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <FiBell style={{ fontSize: '1.15rem' }} />
              {notificationsEnabled && (
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--danger)',
                  borderRadius: '50%'
                }} />
              )}
            </Button>

            {showNotifications && (
              <div className="rounded-card animate-scale-up" style={{
                position: 'absolute',
                top: '45px',
                right: '0',
                width: '280px',
                padding: '1rem',
                zIndex: 60,
                textAlign: 'left'
              }}>
                <h4 className="font-semibold text-sm mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  Notifications
                </h4>
                <div className="flex flex-column" style={{ alignItems: 'center', padding: '1rem 0' }}>
                  <p className="text-sm text-muted-color" style={{ textAlign: 'center' }}>
                    No notifications yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User profile details */}
          <div className="nav-user-profile" onClick={() => navigate('/profile')}>
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'U')}&background=2563EB&color=fff&size=64`}
              alt={user?.name || 'User'} 
              className="nav-avatar" 
            />
            <span className="font-semibold text-sm" style={{ display: 'inline' }}>
              {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Account'}
            </span>
          </div>

          {/* Logout */}
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleLogoutClick}
            icon={FiLogOut}
            title="Logout"
          >
            Logout
          </Button>
        </div>
      </header>
    );
  }

  // 2. Landing / Public Navbar Layout
  return (
    <nav className="landing-nav">
      <Link to="/" className="nav-brand">
        <FiCloud className="nav-brand-icon" />
        <span>CloudDrive</span>
      </Link>

      <ul className="landing-nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="flex align-center gap-3">
        {/* Dark Mode Toggle */}
        <Button 
          variant="icon" 
          onClick={toggleTheme} 
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{ marginRight: '0.5rem' }}
        >
          {isDarkMode ? <FiSun style={{ fontSize: '1.15rem' }} /> : <FiMoon style={{ fontSize: '1.15rem' }} />}
        </Button>
        <Link to="/login">
          <Button variant="secondary" size="sm">Log In</Button>
        </Link>
        <Link to="/signup">
          <Button variant="primary" size="sm">Sign Up</Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
