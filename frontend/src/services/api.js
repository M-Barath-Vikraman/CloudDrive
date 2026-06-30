import axios from 'axios';

// Base URL for the Express.js Backend API
const BASE_URL = import.meta.env.VITE_API_URL;

// API Client configuration for the Express.js backend
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach the JWT token to outgoing backend requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('clouddrive_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const apiService = {
  // Authentication APIs
  login: async (email, password) => {
    console.log('API Service: login called with', { email });
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response;
  },

  signup: async (name, email, password) => {
    console.log('API Service: signup called with', { name, email });
    const response = await apiClient.post('/api/auth/signup', { name, email, password });
    return response;
  },

  // File Metadata CRUD & S3 upload flow
  getFiles: async () => {
    console.log('API Service: getFiles called');
    const response = await apiClient.get('/api/files');
    return response;
  },

  uploadFile: async (userId, file, onProgress) => {
    console.log('API Service: uploadFile started for file:', file.name);

    // 1. Call API Gateway to generate a presigned S3 upload URL and Key
    const gatewayUrl = import.meta.env.VITE_LAMBDA_UPLOAD_URL;
    if (!gatewayUrl) {
      throw new Error('VITE_LAMBDA_UPLOAD_URL is not configured in the environment.');
    }

    const gatewayResponse = await axios.post(gatewayUrl, {
      userId,
      fileName: file.name,
      contentType: file.type || 'application/octet-stream',
    });

    const { uploadUrl, key } = gatewayResponse.data;
    if (!uploadUrl || !key) {
      throw new Error('Failed to retrieve upload URL or key from the upload gateway.');
    }

    // 2. Upload file directly to Amazon S3 using PUT with progress tracking
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    // 3. Save the successfully uploaded file's metadata to the Express backend
    const metadataResponse = await apiClient.post('/api/files', {
      fileName: file.name,
      key: key,
      contentType: file.type || 'application/octet-stream',
      fileSize: file.size,
    });

    return metadataResponse;
  },

  deleteFile: async (fileId) => {
    console.log('API Service: deleteFile called for ID:', fileId);
    const response = await apiClient.delete(`/api/files/${fileId}`);
    return response;
  },

  downloadFile: async (fileId, preview = false) => {
    console.log('API Service: downloadFile called for ID:', fileId, 'preview:', preview);
    const response = await apiClient.get(`/api/files/download/${fileId}`, {
      params: { preview }
    });
    return response;
  },
};

export default apiService;
