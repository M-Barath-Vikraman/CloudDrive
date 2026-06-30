import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiUploadCloud } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import FileCard from '../components/FileCard';
import Loader from '../components/Loader';
import Button from '../components/Button';

const ImagesPage = () => {
  const { files, filesLoading, searchQuery } = useApp();
  const navigate = useNavigate();

  // Filter only images that match search queries
  const images = files.filter(
    (file) => file.type === 'image' && file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Images Gallery</h1>
          <p className="text-sm text-secondary-color">Browse, preview, and download your stored images and photos.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/upload')}
          icon={FiUploadCloud}
        >
          Upload Image
        </Button>
      </div>

      {/* Grid List */}
      <div className="section-card-container">
        {filesLoading ? (
          <Loader type="skeleton" count={4} />
        ) : images.length > 0 ? (
          <div className="files-grid">
            {images.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiImage className="empty-state-icon" />
            <h4 className="empty-state-title">No images found</h4>
            <p className="empty-state-text">
              {searchQuery 
                ? `No images match your search query "${searchQuery}".` 
                : "You haven't uploaded any images yet. Upload JPG/PNG files to view them here."}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/upload')} 
                style={{ marginTop: '1.25rem' }}
              >
                Upload Image
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesPage;
