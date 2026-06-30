import React from 'react';
import { useApp } from '../context/AppContext';

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const StorageCard = ({ className = '' }) => {
  const { user } = useApp();
  const storageUsed = user?.storageUsed || 0;
  const storageMax = user?.storageMax || 15 * 1024 * 1024 * 1024; // Default 15GB
  const percentage = Math.min(((storageUsed / storageMax) * 100), 100);

  return (
    <div className={`storage-card ${className}`}>
      <div className="flex justify-between align-center mb-4" style={{ marginBottom: '0.5rem' }}>
        <h4 className="storage-title" style={{ margin: 0 }}>Storage Space</h4>
        <span className="text-xs font-semibold text-primary-color">{percentage.toFixed(1)}%</span>
      </div>
      <div className="storage-bar-bg">
        <div 
          className="storage-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="storage-text flex justify-between">
        <span>{formatBytes(storageUsed)} of {formatBytes(storageMax)}</span>
      </div>
    </div>
  );
};

export default StorageCard;
