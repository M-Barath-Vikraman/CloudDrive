import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShield, 
  FiZap, 
  FiShare2, 
  FiFolderPlus, 
  FiSmartphone, 
  FiMoon,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCheck,
  FiCloudLightning
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';

const LandingPage = () => {
  const { addToast } = useApp();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      addToast('warning', 'Please fill in all contact form fields.');
      return;
    }
    console.log('Contact form submitted:', contactForm);
    addToast('success', 'Message sent successfully! We will get back to you shortly.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const pricingPlans = [
    {
      name: 'Starter (Free)',
      price: '0',
      description: 'Perfect to try CloudDrive services.',
      features: ['15 GB Secure Storage', 'Standard Upload Speeds', 'Basic File Previews', 'Single Device Sync', 'Community Support'],
      buttonText: 'Get Started Free',
      link: '/signup',
      featured: false
    },
    {
      name: 'Pro Storage',
      price: '9.99',
      description: 'The best option for power users and creators.',
      features: ['2 TB (2,000 GB) Storage', 'Ultra-fast Upload Speeds', 'Full HD Video Playback', 'Unlimited Device Syncs', 'Priority Support (24/7)', 'Advanced Link Sharing Controls'],
      buttonText: 'Upgrade to Pro',
      link: '/signup',
      featured: true
    },
    {
      name: 'Enterprise Cloud',
      price: '29.99',
      description: 'Advanced features for businesses and teams.',
      features: ['10 TB Safe Team Storage', 'Custom Brand Portals', 'Granular Admin Roles', 'SOC-2 Compliance Safe', 'Dedicated Account Manager', 'API Access Keys'],
      buttonText: 'Contact Sales',
      link: '/signup',
      featured: false
    }
  ];

  const features = [
    { icon: FiShield, title: 'Military-Grade Encryption', desc: 'Your files are encrypted in transit and at rest using AES-256 protocols to keep your information secure.' },
    { icon: FiZap, title: 'Lightning Fast Uploads', desc: 'No size throttling. Experience high-speed uploading and downloading optimized globally.' },
    { icon: FiShare2, title: 'Seamless Collaborations', desc: 'Generate secure download shares, customize passwords, and track user actions instantly.' },
    { icon: FiFolderPlus, title: 'Automatic Sorting', desc: 'Keep files sorted. Browse files by Images, Videos, and Documents categories automatically.' },
    { icon: FiSmartphone, title: 'Multi-Device Access', desc: 'Sync files instantly across mobile, tablet, and desktop web applications automatically.' },
    { icon: FiMoon, title: 'Dynamic Dark Mode', desc: 'Sleek, eye-friendly layout that respects your device theme settings seamlessly.' }
  ];

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Navigation Header */}
      <Navbar isDashboard={false} />

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-badge animate-pulse">
            <FiCloudLightning />
            <span>Next-Gen Secure Storage Sandbox</span>
          </div>
          <h1 className="hero-title">Secure & Simple Cloud Storage.</h1>
          <p className="hero-subtitle">
            CloudDrive gives you 15 GB of free storage to store, access, share, and collaborate on your files from any device, anywhere.
          </p>
          <div className="hero-actions">
            <Link to="/signup">
              <Button variant="primary" size="lg">Get Started Free</Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="lg">Learn More</Button>
            </a>
          </div>
        </div>
        <div className="hero-image-container animate-scale-up">
          {/* A premium vector mockup visual represented as CSS layouts */}
          <div className="hero-image" style={{
            width: '420px',
            height: '280px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%',
              top: '-40px',
              right: '-40px'
            }} />
            <div style={{
              width: '80%',
              height: '70%',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '1.25rem',
              color: 'white',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div className="flex align-center gap-2">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <div>
                <h4 className="font-semibold text-lg" style={{ margin: 0 }}>CloudDrive App</h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>Uploading project_proposal.pdf...</p>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '70%', height: '100%', backgroundColor: 'white' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-tag">Key Features</span>
          <h2 className="section-title">Designed for modern workflows</h2>
          <p className="section-subtitle">Discover how CloudDrive streamlines file storage and team collaboration.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="rounded-card feature-card">
              <div className="feature-icon-wrapper">
                <f.icon />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <span className="section-tag">Pricing Options</span>
          <h2 className="section-title">Simple, transparent pricing plans</h2>
          <p className="section-subtitle">Pick the storage space plan that aligns with your demands.</p>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`rounded-card pricing-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && <div className="pricing-popular-badge">Popular</div>}
              <h3 className="pricing-name">{plan.name}</h3>
              <div className="pricing-price">
                ${plan.price}<span>/month</span>
              </div>
              <p className="text-sm text-secondary-color">{plan.description}</p>
              <ul className="pricing-features">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="pricing-feature-item">
                    <FiCheck className="pricing-feature-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link to={plan.link} style={{ display: 'block', marginTop: 'auto' }}>
                <Button 
                  variant={plan.featured ? 'primary' : 'secondary'} 
                  className="w-full"
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-content">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span className="section-tag">About Us</span>
            <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Empowering secure data portability</h2>
          </div>
          <p className="text-secondary-color text-center" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
            Founded in 2026, CloudDrive was built with the mission to democratize cloud storage. We believe that secure, reliable file storage should be accessible to everyone, without sacrificing privacy or speed. Our globally distributed storage grid ensures that your files are safe, backed up, and always within reach.
          </p>
          <div className="grid grid-cols-3 gap-6 text-center mt-4">
            <div className="rounded-card p-6">
              <h4 className="font-semibold text-xl text-primary-color" style={{ fontSize: '2rem' }}>10M+</h4>
              <p className="text-sm text-muted-color">Global Active Users</p>
            </div>
            <div className="rounded-card p-6">
              <h4 className="font-semibold text-xl text-primary-color" style={{ fontSize: '2rem' }}>500M+</h4>
              <p className="text-sm text-muted-color">Files Uploaded Safely</p>
            </div>
            <div className="rounded-card p-6">
              <h4 className="font-semibold text-xl text-primary-color" style={{ fontSize: '2rem' }}>99.99%</h4>
              <p className="text-sm text-muted-color">SLA Service Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="section-header">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">We are here to help you</h2>
          <p className="section-subtitle">Have questions about plans, features, or team upgrades? Drop us a note.</p>
        </div>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <FiMail />
              </div>
              <div>
                <h4>Email support</h4>
                <p>support@clouddrive.com</p>
              </div>
            </div>
            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <FiPhone />
              </div>
              <div>
                <h4>Call us</h4>
                <p>+1 (555) 019-2834</p>
              </div>
            </div>
            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <FiMapPin />
              </div>
              <div>
                <h4>Our headquarters</h4>
                <p>100 Cloud Parkway, Suite 500, San Francisco, CA</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="rounded-card p-6 contact-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                value={contactForm.name} 
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="john@example.com" 
                value={contactForm.email} 
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                className="form-input" 
                placeholder="Tell us what you need..." 
                rows="4"
                style={{ resize: 'vertical' }}
                value={contactForm.message} 
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </div>
            <Button type="submit" variant="primary">Send Message</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
