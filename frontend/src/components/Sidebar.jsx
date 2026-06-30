import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiUploadCloud, 
  FiFolder, 
  FiImage, 
  FiVideo, 
  FiFileText, 
  FiUser, 
  FiSettings 
} from 'react-icons/fi';
import StorageCard from './StorageCard';

const Sidebar = ({ isOpen = true, onCloseMobileSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Upload Files', path: '/upload', icon: FiUploadCloud },
    { name: 'My Files', path: '/files', icon: FiFolder },
  ];

  const categoryItems = [
    { name: 'Images', path: '/category/images', icon: FiImage },
    { name: 'Videos', path: '/category/videos', icon: FiVideo },
    { name: 'Documents', path: '/category/documents', icon: FiFileText },
  ];

  const accountItems = [
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-menu-wrapper flex flex-column h-full">
        {/* Main Nav Section */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.name} onClick={onCloseMobileSidebar}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-item-link ${isActive ? 'active' : ''}`}
                end={item.path === '/dashboard'}
              >
                <item.icon className="sidebar-item-icon" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Categories Section */}
        <h5 className="sidebar-heading">Categories</h5>
        <ul className="sidebar-menu">
          {categoryItems.map((item) => (
            <li key={item.name} onClick={onCloseMobileSidebar}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-item-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="sidebar-item-icon" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Account Section */}
        <h5 className="sidebar-heading">Account</h5>
        <ul className="sidebar-menu">
          {accountItems.map((item) => (
            <li key={item.name} onClick={onCloseMobileSidebar}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `sidebar-item-link ${isActive ? 'active' : ''}`}
              >
                <item.icon className="sidebar-item-icon" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Sidebar bottom Storage statistics card */}
        <StorageCard className="mt-auto" />
      </div>
    </aside>
  );
};

export default Sidebar;
