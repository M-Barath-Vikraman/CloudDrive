import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiFile, 
  FiImage, 
  FiVideo, 
  FiFileText, 
  FiDatabase,
  FiUploadCloud,
  FiArrowRight
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import FileCard from '../components/FileCard';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { formatBytes } from '../components/StorageCard';

const Dashboard = () => {
  const { files, filesLoading, user, searchQuery } = useApp();
  const navigate = useNavigate();

  // Compute statistics dynamically
  const totalFilesCount = files.length;
  
  const imagesCount = files.filter(f => f.type === 'image').length;
  const videosCount = files.filter(f => f.type === 'video').length;
  
  const documentsCount = files.filter(f => 
    ['pdf', 'word', 'excel', 'ppt', 'txt'].includes(f.type)
  ).length;

  const storageUsed = user?.storageUsed || 0;
  const storageMax = user?.storageMax || 15 * 1024 * 1024 * 1024;
  const storagePercentage = Math.min(((storageUsed / storageMax) * 100), 100);

  // Apply search query filter if user typed anything
  const filteredFiles = files.filter(file => 
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Limit dashboard recent files preview
  const recentFiles = filteredFiles.slice(0, 4);

  const stats = [
    { 
      label: 'Total Files', 
      value: totalFilesCount, 
      icon: FiFile, 
      color: '#eff6ff', 
      iconColor: '#2563eb',
      onClick: () => navigate('/files')
    },
    { 
      label: 'Images', 
      value: imagesCount, 
      icon: FiImage, 
      color: '#f0fdf4', 
      iconColor: '#16a34a',
      onClick: () => navigate('/category/images')
    },
    { 
      label: 'Videos', 
      value: videosCount, 
      icon: FiVideo, 
      color: '#fffbeb', 
      iconColor: '#d97706',
      onClick: () => navigate('/category/videos')
    },
    { 
      label: 'Documents', 
      value: documentsCount, 
      icon: FiFileText, 
      color: '#fdf2f8', 
      iconColor: '#db2777',
      onClick: () => navigate('/category/documents')
    },
    { 
      label: 'Storage Used', 
      value: `${storagePercentage.toFixed(1)}%`, 
      icon: FiDatabase, 
      color: '#ecfeff', 
      iconColor: '#0891b2',
      isStorage: true,
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Dashboard Overview</h1>
          <p className="text-sm text-secondary-color">Welcome back! Manage and review your cloud files.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/upload')}
          icon={FiUploadCloud}
        >
          Upload New File
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="rounded-card stat-card card-interactive"
            onClick={stat.onClick}
          >
            <div 
              className="stat-icon-wrapper" 
              style={{ backgroundColor: stat.color, color: stat.iconColor }}
            >
              <stat.icon />
            </div>
            <div className="stat-info flex-1">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              
              {stat.isStorage && (
                <div className="stat-storage-progress">
                  <div 
                    style={{ 
                      width: `${storagePercentage}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--primary)' 
                    }} 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Files Grid */}
      <div className="section-card-container">
        <div className="section-subheader">
          <h3 className="section-subtitle-text">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Uploads'}
          </h3>
          {!searchQuery && files.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/files')}
              icon={FiArrowRight}
              style={{ flexDirection: 'row-reverse' }}
            >
              View All Files
            </Button>
          )}
        </div>

        {filesLoading ? (
          <Loader type="skeleton" count={4} />
        ) : recentFiles.length > 0 ? (
          <div className="files-grid">
            {recentFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiUploadCloud className="empty-state-icon" />
            <h4 className="empty-state-title">No files found</h4>
            <p className="empty-state-text">
              {searchQuery 
                ? "We couldn't find any files matching your search query. Try checking your spelling." 
                : "You haven't uploaded any files yet. Drag and drop files to get started."}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/upload')} 
                style={{ marginTop: '1.25rem' }}
              >
                Upload Your First File
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
