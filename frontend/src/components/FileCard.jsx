import React, { useState } from 'react';
import { 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint, 
  FaFileImage, 
  FaFileVideo, 
  FaFileAlt, 
  FaFileArchive, 
  FaDownload, 
  FaTrashAlt, 
  FaEye 
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { formatBytes } from './StorageCard';
import Button from './Button';
import Modal from './Modal';

const FileCard = ({ file }) => {
  const { handleDelete, handleDownload, getFilePreviewUrl } = useApp();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const getFileIconAndClass = (type) => {
    switch (type) {
      case 'pdf':
        return { icon: <FaFilePdf />, className: 'file-icon-pdf' };
      case 'word':
        return { icon: <FaFileWord />, className: 'file-icon-word' };
      case 'excel':
        return { icon: <FaFileExcel />, className: 'file-icon-excel' };
      case 'ppt':
        return { icon: <FaFilePowerpoint />, className: 'file-icon-ppt' };
      case 'image':
        return { icon: <FaFileImage />, className: 'file-icon-image' };
      case 'video':
        return { icon: <FaFileVideo />, className: 'file-icon-video' };
      case 'txt':
        return { icon: <FaFileAlt />, className: 'file-icon-txt' };
      case 'other':
      default:
        return { icon: <FaFileArchive />, className: 'file-icon-other' };
    }
  };

  const { icon, className } = getFileIconAndClass(file.type);

  const onDeleteClick = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${file.fileName}"?`)) {
      setIsDeleting(true);
      await handleDelete(file.id);
      setIsDeleting(false);
    }
  };

  const onDownloadClick = async (e) => {
    e.stopPropagation();
    await handleDownload(file.id);
  };

  // Intercept document preview to open directly in a new tab via S3 presigned URL
  const handlePreviewTrigger = async (e) => {
    e.stopPropagation();
    const isPDF = file.fileName.toLowerCase().endsWith('.pdf');

    // For non-PDF document formats, continue downloading directly
    if (file.type !== 'image' && file.type !== 'video' && !isPDF) {
      await handleDownload(file.id);
      return;
    }

    try {
      setLoadingPreview(true);
      setIsPreviewOpen(true);
      const url = await getFilePreviewUrl(file.id);
      if (url) {
        setPreviewUrl(url);
      }
    } catch (err) {
      console.error('Failed to resolve preview url', err);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
  };

  // Render preview body content based on file type
  const renderPreviewContent = () => {
    if (loadingPreview) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="text-secondary-color">Generating secure preview link...</p>
        </div>
      );
    }

    if (!previewUrl) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="text-secondary-color">Could not load preview.</p>
        </div>
      );
    }

    if (file.type === 'image') {
      return (
        <div style={{ textAlign: 'center' }}>
          <img 
            src={previewUrl} 
            alt={file.fileName} 
            style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: 'var(--radius-md)' }} 
          />
        </div>
      );
    }
    if (file.type === 'video') {
      return (
        <div style={{ textAlign: 'center' }}>
          <video 
            controls 
            autoPlay
            style={{ width: '100%', maxHeight: '360px', borderRadius: 'var(--radius-md)' }}
            src={previewUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    if (file.fileName.toLowerCase().endsWith('.pdf')) {
      return (
        <div style={{ width: '100%', height: '500px' }}>
          <iframe
            src={previewUrl}
            title={file.fileName}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-md)' }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className={`rounded-card file-card animate-fade-in ${isDeleting ? 'animate-pulse' : ''}`}>
        <div className="file-card-preview" onClick={handlePreviewTrigger} style={{ cursor: 'pointer' }}>
          {file.type === 'image' && file.thumbnail ? (
            <img src={file.thumbnail} alt={file.fileName} className="file-preview-img" />
          ) : file.type === 'video' && file.thumbnail ? (
            <img src={file.thumbnail} alt={file.fileName} className="file-preview-img" style={{ filter: 'brightness(0.8)' }} />
          ) : (
            <div className={`file-preview-icon ${className}`}>{icon}</div>
          )}
        </div>
        <div className="file-card-info">
          <span className="file-card-name" title={file.fileName}>{file.fileName}</span>
          <div className="file-card-meta">
            <span>{formatBytes(file.size)}</span>
            <span>{file.uploadedDate}</span>
          </div>
        </div>
        <div className="file-card-actions">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handlePreviewTrigger} 
            icon={FaEye}
            style={{ padding: '0.35rem 0.6rem' }}
            title="Preview"
          >
            Preview
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onDownloadClick} 
            icon={FaDownload}
            style={{ padding: '0.35rem 0.6rem' }}
            title="Download"
          />
          <Button 
            variant="danger" 
            size="sm" 
            onClick={onDeleteClick} 
            icon={FaTrashAlt}
            style={{ padding: '0.35rem 0.6rem' }}
            disabled={isDeleting}
            title="Delete"
          />
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title={file.fileName}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleClosePreview}>
              Close
            </Button>
            <Button variant="primary" onClick={onDownloadClick} icon={FaDownload}>
              Download
            </Button>
          </div>
        }
      >
        {renderPreviewContent()}
      </Modal>
    </>
  );
};

export default FileCard;
