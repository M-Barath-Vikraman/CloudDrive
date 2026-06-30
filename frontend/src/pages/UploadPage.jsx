import React from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import UploadBox from '../components/UploadBox';

const UploadPage = () => {
  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Upload Files</h1>
          <p className="text-sm text-secondary-color">Upload document templates, media content, and archive zip packages.</p>
        </div>
      </div>

      {/* Upload card container */}
      <div className="rounded-card p-8 text-center flex flex-column align-center justify-center">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <UploadBox />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
