import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="public-page">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="logo">⚡ SwiftChain Logistics</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/track">Track</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="btn-login">Login</Link></li>
          </ul>
        </div>
      </nav>

      <section className="page-hero">
        <div className="container">
          <h2>Contact Us</h2>
          <p>Get in touch with our team</p>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        {submitted && <div style={{
          background: '#d1fae5',
          color: '#065f46',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '2rem',
          borderLeft: '4px solid #10b981'
        }}>Thank you for your message. We'll get back to you soon!</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            required
          />
          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows="5"
            required
          />
          <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
        </form>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2024 SwiftChain Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
