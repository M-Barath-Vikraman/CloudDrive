import React from 'react';
import { FiCloud, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer" id="about">
      <div className="footer-grid">
        {/* Brand details */}
        <div className="footer-col footer-col-about">
          <div className="nav-brand" style={{ padding: 0, marginBottom: '0.5rem' }}>
            <FiCloud className="nav-brand-icon" />
            <span>CloudDrive</span>
          </div>
          <p className="text-sm text-secondary-color" style={{ maxWidth: '300px' }}>
            Secure, fast, and modern cloud storage solution designed for teams and individuals. Store, share, and collaborate on your files from anywhere.
          </p>
          <div className="flex gap-3 mt-4" style={{ marginTop: '1rem' }}>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="btn-icon-only" style={{ padding: '0.4rem' }}>
              <FiTwitter style={{ fontSize: '1.15rem' }} />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-icon-only" style={{ padding: '0.4rem' }}>
              <FiGithub style={{ fontSize: '1.15rem' }} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-icon-only" style={{ padding: '0.4rem' }}>
              <FiLinkedin style={{ fontSize: '1.15rem' }} />
            </a>
          </div>
        </div>

        {/* Column 1 - Product */}
        <div className="footer-col">
          <h4>Product</h4>
          <ul className="footer-links text-sm">
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing Plans</a></li>
            <li><a href="#security">Security Core</a></li>
            <li><a href="#enterprise">Enterprise Solutions</a></li>
          </ul>
        </div>

        {/* Column 2 - Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links text-sm">
            <li><a href="#about">About Us</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press Kit</a></li>
            <li><a href="#news">Latest News</a></li>
          </ul>
        </div>

        {/* Column 3 - Contact & Support */}
        <div className="footer-col" id="contact-footer">
          <h4>Support</h4>
          <ul className="footer-links text-sm">
            <li><a href="#help">Help Center</a></li>
            <li><a href="#contact">Contact Support</a></li>
            <li><a href="#privacy">Privacy & Terms</a></li>
            <li><a href="#status">System Status</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CloudDrive Inc. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
