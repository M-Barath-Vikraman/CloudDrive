import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCloud, FiLock, FiMail } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Modal from '../components/Modal';

const LoginPage = () => {
  const { handleLogin, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('warning', 'Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await handleLogin(email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      addToast('warning', 'Please enter your email address.');
      return;
    }
    
    setForgotLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setForgotLoading(false);
    setIsForgotOpen(false);
    addToast('success', `Reset password link has been sent to ${forgotEmail}`);
    setForgotEmail('');
  };

  return (
    <div className="auth-page">
      <div className="rounded-card auth-card animate-scale-up">
        <header className="auth-header">
          <Link to="/" className="auth-logo">
            <FiCloud />
            <span>CloudDrive</span>
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to manage your secure drive vault</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '36px' }}
                required
              />
            </div>
          </div>

          <div className="auth-options">
            <label className="flex align-center gap-2" style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} />
              <span>Remember me</span>
            </label>
            <button 
              type="button" 
              className="auth-forgot" 
              onClick={() => setIsForgotOpen(true)}
            >
              Forgot Password?
            </button>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-footer-link">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        title="Forgot Password"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsForgotOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleForgotSubmit}
              disabled={forgotLoading}
            >
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleForgotSubmit} className="flex flex-column gap-3 text-left">
          <p className="text-sm text-secondary-color">
            Enter the email address associated with your CloudDrive account, and we will send you a link to reset your password.
          </p>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@example.com" 
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
