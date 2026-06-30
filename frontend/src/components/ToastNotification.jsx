import React from 'react';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiX 
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ToastNotification = () => {
  const { toasts, removeToast } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="toast-icon toast-icon-success" />;
      case 'error':
        return <FiAlertCircle className="toast-icon toast-icon-error" />;
      case 'warning':
        return <FiAlertTriangle className="toast-icon toast-icon-warning" />;
      case 'info':
      default:
        return <FiInfo className="toast-icon toast-icon-info" />;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {getIcon(toast.type)}
          <span className="toast-message">{toast.message}</span>
          <FiX 
            className="toast-close" 
            onClick={() => removeToast(toast.id)} 
          />
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
