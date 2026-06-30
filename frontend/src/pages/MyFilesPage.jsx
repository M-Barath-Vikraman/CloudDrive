import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiUploadCloud } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import FileCard from '../components/FileCard';
import Loader from '../components/Loader';
import Button from '../components/Button';

const MyFilesPage = () => {
  const { files, filesLoading, searchQuery } = useApp();
  const navigate = useNavigate();

  // Filter files based on global search query
  const filteredFiles = files.filter((file) => 
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>My Files</h1>
          <p className="text-sm text-secondary-color">Browse and manage all files stored in your CloudDrive account.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/upload')}
          icon={FiUploadCloud}
        >
          Upload File
        </Button>
      </div>

      {/* Main Grid */}
      <div className="section-card-container">
        {filesLoading ? (
          <Loader type="skeleton" count={8} />
        ) : filteredFiles.length > 0 ? (
          <div className="files-grid">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiFolder className="empty-state-icon" />
            <h4 className="empty-state-title">No files found</h4>
            <p className="empty-state-text">
              {searchQuery 
                ? `We couldn't find any files matching "${searchQuery}".` 
                : "You don't have any files in your drive folder. Upload some to view them here."}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/upload')} 
                style={{ marginTop: '1.25rem' }}
              >
                Upload File
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFilesPage;
