import React, { useState } from 'react';
import { FiUser, FiMail, FiCalendar, FiHardDrive, FiFolder, FiEdit } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { formatBytes } from '../components/StorageCard';
import Button from '../components/Button';
import Modal from '../components/Modal';

const ProfilePage = () => {
  const { user, updateProfile } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Safe initialisation — user may be null before backend data arrives
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editName, editEmail, editAvatar);
    setIsEditOpen(false);
  };

  const storageUsed = user?.storageUsed || 0;
  const storageMax = user?.storageMax || 15 * 1024 * 1024 * 1024;
  const storagePercentage = Math.min(((storageUsed / storageMax) * 100), 100);

  // Generate avatar: use provided URL, or fall back to initials-based generated image
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const avatarSrc = user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563EB&color=fff&size=128`;

  return (
    <div className="flex flex-column gap-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>My Profile</h1>
          <p className="text-sm text-secondary-color">Manage your user profile details and check storage telemetry.</p>
        </div>
      </div>

      {/* Main Profile Columns */}
      <div className="profile-container w-full">
        {/* Left Card - Avatar */}
        <div className="rounded-card profile-card-left">
          <div className="profile-pic-wrapper">
            <img
              src={avatarSrc}
              alt={displayName}
              className="profile-pic-large"
            />
          </div>
          <h3 className="profile-name">{user?.name || '—'}</h3>
          <p className="profile-email">{user?.email || '—'}</p>
          <div className="profile-info-divider" />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setEditName(user?.name || '');
              setEditEmail(user?.email || '');
              setEditAvatar(user?.avatar || '');
              setIsEditOpen(true);
            }}
            icon={FiEdit}
          >
            Edit Profile
          </Button>
        </div>

        {/* Right Card - Details */}
        <div className="rounded-card profile-card-right">
          <h3 className="font-semibold text-lg" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Account Summary
          </h3>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <span className="profile-detail-label flex align-center gap-2">
                <FiCalendar style={{ color: 'var(--primary)' }} />
                <span>Joined Date</span>
              </span>
              <span className="profile-detail-value">{user?.joinedDate || '—'}</span>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label flex align-center gap-2">
                <FiFolder style={{ color: 'var(--success)' }} />
                <span>Total Uploads</span>
              </span>
              <span className="profile-detail-value">{user?.totalUploads ?? 0} files</span>
            </div>

            <div className="profile-detail-item" style={{ gridColumn: 'span 2' }}>
              <span className="profile-detail-label flex align-center gap-2">
                <FiHardDrive style={{ color: 'var(--warning)' }} />
                <span>Storage Utilization</span>
              </span>
              <span className="profile-detail-value">
                {formatBytes(storageUsed)} of {formatBytes(storageMax)} used ({storagePercentage.toFixed(1)}%)
              </span>
              <div className="stat-storage-progress" style={{ marginTop: '0.5rem', height: '8px' }}>
                <div
                  style={{
                    width: `${storagePercentage}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </div>
        }
      >
        <form onSubmit={handleEditSubmit} className="flex flex-column gap-3 text-left">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ paddingLeft: '36px' }}
                placeholder="Your full name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{ paddingLeft: '36px' }}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL</label>
            <input
              type="text"
              className="form-input"
              value={editAvatar}
              onChange={(e) => setEditAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg (optional)"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
