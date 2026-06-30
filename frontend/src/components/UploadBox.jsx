import React, { useState, useRef } from 'react';
import { 
  FiUploadCloud, 
  FiFile, 
  FiImage, 
  FiVideo, 
  FiFileText, 
  FiCheckCircle, 
  FiXCircle 
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Button from './Button';
import { formatBytes } from './StorageCard';

const UploadBox = () => {
  const { handleUpload, addToast } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // File icons helper
  const getFileIcon = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return <FiImage className="file-icon-image" style={{ fontSize: '2.5rem' }} />;
    }
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
      return <FiVideo className="file-icon-video" style={{ fontSize: '2.5rem' }} />;
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(ext)) {
      return <FiFileText className="file-icon-word" style={{ fontSize: '2.5rem' }} />;
    }
    return <FiFile className="file-icon-other" style={{ fontSize: '2.5rem' }} />;
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    setSelectedFile(file);
    setUploadSuccess(false);
    setUploadProgress(0);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const startUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const res = await handleUpload(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      if (res.success) {
        setUploadSuccess(true);
        addToast('success', `Successfully uploaded "${selectedFile.name}"`);
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Something went wrong during file upload.');
    } finally {
      setUploading(false);
    }
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Upload Zone */}
      {!selectedFile && (
        <div 
          className={`upload-box ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleChange}
            style={{ display: 'none' }}
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.mp4,.mov,.avi,.mkv,.webm,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          />
          <FiUploadCloud className="upload-box-icon" />
          <h3 className="upload-box-title">Drag & drop your files here</h3>
          <p className="upload-box-text">Supports Images, Videos, PDFs, Word documents, Excel sheets, and more</p>
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.stopPropagation();
              triggerFileSelect();
            }}
          >
            Browse Files
          </Button>
        </div>
      )}

      {/* Preview and Progress Area */}
      {selectedFile && (
        <div className="upload-preview-container flex flex-column align-center" style={{ margin: '0 auto' }}>
          <div className="upload-preview-file w-full">
            {getFileIcon(selectedFile)}
            <div className="upload-preview-info">
              <h4 className="font-semibold text-sm" style={{ wordBreak: 'break-all' }}>{selectedFile.name}</h4>
              <p className="text-xs text-muted-color">{formatBytes(selectedFile.size)}</p>
            </div>
            {!uploading && !uploadSuccess && (
              <Button 
                variant="icon" 
                size="sm" 
                onClick={cancelSelection}
              >
                <FiXCircle style={{ fontSize: '1.25rem', color: 'var(--danger)' }} />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          {(uploading || uploadProgress > 0) && (
            <div className="w-full mt-4">
              <div className="flex justify-between text-xs text-secondary-color mb-1">
                <span>{uploading ? 'Uploading...' : 'Completed'}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="upload-progress-bar">
                <div 
                  className="upload-progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="flex align-center gap-2 mt-4 text-success font-medium text-sm">
              <FiCheckCircle />
              <span>File uploaded successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 w-full mt-4 justify-end">
            {!uploadSuccess ? (
              <>
                <Button 
                  variant="secondary" 
                  onClick={cancelSelection}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={startUpload}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                onClick={cancelSelection}
              >
                Upload Another File
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
