import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiUploadCloud } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import FileCard from '../components/FileCard';
import Loader from '../components/Loader';
import Button from '../components/Button';

const DocumentsPage = () => {
  const { files, filesLoading, searchQuery } = useApp();
  const navigate = useNavigate();

  // Filter only documents: pdf, word, excel, ppt, txt
  const documentTypes = ['pdf', 'word', 'excel', 'ppt', 'txt'];
  const documents = files.filter(
    (file) => documentTypes.includes(file.type) && file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Documents</h1>
          <p className="text-sm text-secondary-color">Access and download your reports, spreadsheets, presentations, and texts.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/upload')}
          icon={FiUploadCloud}
        >
          Upload Document
        </Button>
      </div>

      {/* Grid List */}
      <div className="section-card-container">
        {filesLoading ? (
          <Loader type="skeleton" count={6} />
        ) : documents.length > 0 ? (
          <div className="files-grid">
            {documents.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FiFileText className="empty-state-icon" />
            <h4 className="empty-state-title">No documents found</h4>
            <p className="empty-state-text">
              {searchQuery 
                ? `No documents match your search query "${searchQuery}".` 
                : "You haven't uploaded any documents yet. Upload PDF, Word, Excel, PPT, or TXT files."}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/upload')} 
                style={{ marginTop: '1.25rem' }}
              >
                Upload Document
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
