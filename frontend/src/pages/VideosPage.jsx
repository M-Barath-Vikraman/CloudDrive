import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiVideo, FiUploadCloud } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import FileCard from '../components/FileCard';
import Loader from '../components/Loader';
import Button from '../components/Button';

const VideosPage = () => {
  const { files, filesLoading, searchQuery } = useApp();
  const navigate = useNavigate();

  // Filter only video files matching search queries
  const videos = files.filter(
    (file) => file.type === 'video' && file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Videos Library</h1>
          <p className="text-sm text-secondary-color">Browse and play your uploaded videos directly in the browser.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/upload')}
          icon={FiUploadCloud}
        >
          Upload Video
        </Button>
      </div>

      {/* Grid List */}
      <div className="section-card-container">
        {filesLoading ? (
          <Loader type="skeleton" count={4} />
        ) : videos.length > 0 ? (
          <div className="files-grid">
            {videos.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiVideo className="empty-state-icon" />
            <h4 className="empty-state-title">No videos found</h4>
            <p className="empty-state-text">
              {searchQuery 
                ? `No videos match your search query "${searchQuery}".` 
                : "You haven't uploaded any videos yet. Upload MP4 files to view and play them here."}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/upload')} 
                style={{ marginTop: '1.25rem' }}
              >
                Upload Video
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosPage;
