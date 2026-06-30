import React from 'react';

export const Spinner = ({ size = 'md' }) => {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-preview"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line short" style={{ width: '40%', marginTop: 'auto' }}></div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 4 }) => {
  return (
    <div className="files-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

const Loader = ({ type = 'spinner', count = 4 }) => {
  if (type === 'skeleton') {
    return <SkeletonGrid count={count} />;
  }
  return <Spinner />;
};

export default Loader;
