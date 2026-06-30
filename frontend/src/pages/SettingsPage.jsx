import React, { useState } from 'react';
import { FiMoon, FiBell, FiLock, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Modal from '../components/Modal';

const SettingsPage = () => {
  const { 
    isDarkMode, 
    setIsDarkMode, 
    notificationsEnabled, 
    setNotificationsEnabled,
    changePassword,
    deleteAccount,
    addToast
  } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('warning', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      addToast('warning', 'Password must be at least 6 characters.');
      return;
    }
    
    changePassword(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmText !== 'DELETE') {
      addToast('warning', 'Please type DELETE to confirm account closure.');
      return;
    }
    deleteAccount();
    setIsDeleteOpen(false);
  };

  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>System Settings</h1>
          <p className="text-sm text-secondary-color">Configure preferences, update security, or manage your account details.</p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="settings-container w-full">
        {/* Section 1 - Preferences */}
        <div className="rounded-card settings-section-card">
          <h3 className="settings-section-title">Preferences</h3>
          
          {/* Dark Mode Row */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title flex align-center gap-2">
                <FiMoon />
                <span>Dark Mode</span>
              </span>
              <span className="setting-description">Enable light-sensitive layouts across the application workspace.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={(e) => setIsDarkMode(e.target.checked)} 
              />
              <span className="switch-slider"></span>
            </label>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border)' }} />

          {/* Notifications Row */}
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title flex align-center gap-2">
                <FiBell />
                <span>System Notifications</span>
              </span>
              <span className="setting-description">Get alerts for successful file uploads and trash actions.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={notificationsEnabled} 
                onChange={(e) => setNotificationsEnabled(e.target.checked)} 
              />
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>

        {/* Section 2 - Change Password */}
        <div className="rounded-card settings-section-card">
          <h3 className="settings-section-title">Security & Password</h3>
          <form onSubmit={handlePasswordSubmit} className="flex flex-column gap-4 text-left" style={{ maxWidth: '400px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Min. 6 characters" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Repeat new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </form>
        </div>

        {/* Section 3 - Danger Zone */}
        <div className="rounded-card settings-section-card" style={{ borderColor: 'var(--danger-light)', backgroundColor: 'rgba(239, 68, 68, 0.02)' }}>
          <h3 className="settings-section-title" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)' }}>Danger Zone</h3>
          
          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title flex align-center gap-2" style={{ color: 'var(--danger)' }}>
                <FiTrash2 />
                <span>Delete Account</span>
              </span>
              <span className="setting-description">Permanently delete your drive files, folders, and profile. This action is irreversible.</span>
            </div>
            <Button 
              variant="danger" 
              onClick={() => {
                setDeleteConfirmText('');
                setIsDeleteOpen(true);
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Account Permanently"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirm}
              disabled={deleteConfirmText !== 'DELETE'}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        }
      >
        <div className="flex flex-column gap-3 text-left">
          <div className="flex align-center gap-2" style={{ color: 'var(--danger)', fontSize: '1.1rem', fontWeight: 600 }}>
            <FiAlertTriangle />
            <span>Warning: Account Deletion</span>
          </div>
          <p className="text-sm text-secondary-color">
            You are about to delete your CloudDrive account. All uploaded files, images, documents, and settings will be permanently destroyed. This cannot be undone.
          </p>
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label className="form-label" style={{ color: 'var(--text-secondary)' }}>
              Type <strong style={{ color: 'var(--danger)' }}>DELETE</strong> to confirm:
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="DELETE" 
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
