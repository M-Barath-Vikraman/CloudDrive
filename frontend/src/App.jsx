import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ToastNotification from './components/ToastNotification';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import MyFilesPage from './pages/MyFilesPage';
import ImagesPage from './pages/ImagesPage';
import VideosPage from './pages/VideosPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Application Navigation Routes */}
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard Workspace */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/files" element={<MyFilesPage />} />
            
            {/* Categories */}
            <Route path="/category/images" element={<ImagesPage />} />
            <Route path="/category/videos" element={<VideosPage />} />
            <Route path="/category/documents" element={<DocumentsPage />} />

            {/* Profile & Settings */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Floating Toast Alert Container */}
        <ToastNotification />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
