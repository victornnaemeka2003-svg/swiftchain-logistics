import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function About() {
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
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="btn-login">Login</Link></li>
          </ul>
        </div>
      </nav>

      <section className="page-hero">
        <div className="container">
          <h2>About SwiftChain Logistics</h2>
          <p>Learn more about our company and mission</p>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3>Our Story</h3>
          <p>SwiftChain Logistics was founded with a mission to revolutionize the logistics industry through innovation, reliability, and customer-centric solutions. With over 20 years of experience, we have become a trusted partner for businesses worldwide.</p>

          <h3>Our Mission</h3>
          <p>To provide fast, reliable, and affordable logistics solutions that connect businesses with their customers across the globe.</p>

          <h3>Our Values</h3>
          <ul>
            <li><strong>Reliability:</strong> We ensure your shipments reach their destination on time, every time.</li>
            <li><strong>Innovation:</strong> We leverage cutting-edge technology for better tracking and management.</li>
            <li><strong>Customer Focus:</strong> Your satisfaction is our priority.</li>
            <li><strong>Sustainability:</strong> We commit to environmentally responsible practices.</li>
          </ul>

          <h3>Our Team</h3>
          <p>Our dedicated team consists of logistics experts, technology professionals, and customer service specialists committed to delivering excellence.</p>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SwiftChain Logistics</h4>
              <p>Your trusted logistics partner</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/services">Services</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SwiftChain Logistics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;
