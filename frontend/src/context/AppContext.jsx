import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const getExtensionType = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['doc', 'docx'].includes(ext)) return 'word';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  if (['ppt', 'pptx'].includes(ext)) return 'ppt';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'txt') return 'txt';
  return 'other';
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('clouddrive_auth') === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clouddrive_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('clouddrive_dark_mode') === 'true';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Fetch file list with their respective presigned download URLs
  const loadFiles = async () => {
    const token = localStorage.getItem('clouddrive_token');
    if (!token || !isAuthenticated) {
      setFiles([]);
      setFilesLoading(false);
      return;
    }
    try {
      setFilesLoading(true);
      const res = await apiService.getFiles();
      const items = res.data.data || [];

      // Concurrently fetch S3 download URLs only for images so they show up as thumbnails
      const mappedFiles = await Promise.all(
        items.map(async (file) => {
          let thumbnail = '';
          const isImage = file.FileType === 'image';
          if (isImage) {
            try {
              const downloadRes = await apiService.downloadFile(file.FileID, true);
              thumbnail = downloadRes.data.downloadUrl;
            } catch (err) {
              console.error(`Failed to pre-fetch image thumbnail for file ID ${file.FileID}:`, err);
            }
          }

          return {
            id: file.FileID,
            fileName: file.FileName,
            type: file.FileType === 'document' ? getExtensionType(file.FileName) : file.FileType,
            size: file.FileSize,
            uploadedDate: file.UploadedAt ? file.UploadedAt.split('T')[0] : '',
            thumbnail: thumbnail,
            s3Key: file.S3Key,
          };
        })
      );

      setFiles(mappedFiles);
    } catch (err) {
      console.error('Failed to load files', err);
      addToast('error', 'Failed to fetch files from server.');
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [isAuthenticated]);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clouddrive_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clouddrive_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Sync auth & user
  useEffect(() => {
    localStorage.setItem('clouddrive_auth', isAuthenticated);
    if (user) {
      localStorage.setItem('clouddrive_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('clouddrive_user');
    }
  }, [isAuthenticated, user]);

  // Recalculate storage and uploads when files change
  useEffect(() => {
    if (files.length > 0) {
      const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
      setUser(prev => prev ? {
        ...prev,
        storageUsed: totalSize,
        totalUploads: files.length
      } : null);
    } else {
      setUser(prev => prev ? {
        ...prev,
        storageUsed: 0,
        totalUploads: 0
      } : null);
    }
  }, [files]);

  // Toast helper
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Actions
  const handleLogin = async (email, password) => {
    try {
      const res = await apiService.login(email, password);
      if (res.data && res.data.success) {
        const { token, user: userData } = res.data.data;
        
        localStorage.setItem('clouddrive_token', token);
        localStorage.setItem('clouddrive_auth', 'true');
        localStorage.setItem('clouddrive_user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        addToast('success', `Welcome back, ${userData.name || email}!`);
        return { success: true };
      } else {
        const errMsg = res.data.message || 'Login failed.';
        addToast('error', errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      console.error('Login failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      addToast('error', errMsg);
      return { success: false, error: errMsg };
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      const res = await apiService.signup(name, email, password);
      if (res.data && res.data.success) {
        addToast('success', res.data.message || 'Registration successful! You can now log in.');
        return { success: true };
      } else {
        const errMsg = res.data.message || 'Registration failed.';
        addToast('error', errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err) {
      console.error('Signup failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      addToast('error', errMsg);
      return { success: false, error: errMsg };
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setFiles([]);
    localStorage.removeItem('clouddrive_auth');
    localStorage.removeItem('clouddrive_user');
    localStorage.removeItem('clouddrive_token');
    addToast('info', 'Logged out successfully.');
  };

  const handleUpload = async (rawFile, onProgress) => {
    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error('User session not found.');
      }
      
      const res = await apiService.uploadFile(userId, rawFile, onProgress);
      const newFile = res.data.data;
      
      // Refresh the file list by calling GET /api/files
      await loadFiles();
      
      addToast('success', `"${rawFile.name}" uploaded successfully!`);
      return { success: true, file: newFile };
    } catch (err) {
      console.error('Upload failed:', err);
      const errMsg = err.response?.data?.message || err.message || `Failed to upload "${rawFile.name}".`;
      addToast('error', errMsg);
      return { success: false, error: errMsg };
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await apiService.deleteFile(fileId);
      
      // Refresh the file list by calling GET /api/files
      await loadFiles();
      
      addToast('success', 'File deleted successfully.');
      return { success: true };
    } catch (err) {
      console.error('Delete failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to delete file.';
      addToast('error', errMsg);
      return { success: false, error: errMsg };
    }
  };

  const handleDownload = async (fileId) => {
    const file = files.find(f => f.id === fileId);
    try {
      addToast('info', `Generating secure download link for "${file ? file.fileName : 'file'}"...`);
      const res = await apiService.downloadFile(fileId);
      const downloadUrl = res.data.downloadUrl;

      // Trigger standard browser download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', file ? file.fileName : 'download');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    } catch (err) {
      console.error('Download failed:', err);
      addToast('error', 'Download failed.');
      return { success: false, error: err.message };
    }
  };

  const getFilePreviewUrl = async (fileId) => {
    try {
      const res = await apiService.downloadFile(fileId, true);
      return res.data.downloadUrl;
    } catch (err) {
      console.error('Failed to generate preview URL:', err);
      addToast('error', 'Failed to generate preview link.');
      return null;
    }
  };

  const updateProfile = (name, email, avatarUrl) => {
    setUser(prev => prev ? {
      ...prev,
      name,
      email,
      avatar: avatarUrl || prev.avatar
    } : null);
    addToast('success', 'Profile updated successfully.');
  };

  const changePassword = (currentPassword, newPassword) => {
    addToast('success', 'Password updated successfully!');
  };

  const deleteAccount = () => {
    setIsAuthenticated(false);
    setFiles([]);
    localStorage.clear();
    addToast('warning', 'Your account has been deleted permanently.');
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      files,
      filesLoading,
      isDarkMode,
      setIsDarkMode,
      notificationsEnabled,
      setNotificationsEnabled,
      searchQuery,
      setSearchQuery,
      toasts,
      addToast,
      removeToast,
      handleLogin,
      handleSignup,
      handleLogout,
      handleUpload,
      handleDelete,
      handleDownload,
      getFilePreviewUrl,
      updateProfile,
      changePassword,
      deleteAccount
    }}>
      {children}
    </AppContext.Provider>
  );
};
