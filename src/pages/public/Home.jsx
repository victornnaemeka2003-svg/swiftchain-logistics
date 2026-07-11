import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Home.css';

function Home() {
  return (
    <div className="home">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2 className="hero-title">Swift, Reliable Logistics Solutions</h2>
          <p className="hero-subtitle">Track your shipments in real-time with our advanced logistics platform</p>
          <div className="hero-cta">
            <Link to="/track" className="btn btn-primary btn-lg">Track Shipment</Link>
            <Link to="/pricing" className="btn btn-secondary btn-lg">Get Quote</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stat-card">
            <h3>50M+</h3>
            <p>Shipments Delivered</p>
          </div>
          <div className="stat-card">
            <h3>195</h3>
            <p>Countries Served</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Customer Support</p>
          </div>
          <div className="stat-card">
            <h3>99.8%</h3>
            <p>On-Time Delivery</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">✈️</div>
              <h3>Air Freight</h3>
              <p>Fast international shipping via air cargo</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚢</div>
              <h3>Ocean Freight</h3>
              <p>Economical sea shipping for large volumes</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🚚</div>
              <h3>Road Freight</h3>
              <p>Reliable ground transportation across regions</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>Warehousing</h3>
              <p>Secure storage and inventory management</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose">
        <div className="container">
          <h2 className="section-title">Why Choose SwiftChain?</h2>
          <div className="features-grid">
            <div className="feature">
              <h4>Real-Time Tracking</h4>
              <p>Track your shipments in real-time from pickup to delivery</p>
            </div>
            <div className="feature">
              <h4>Global Network</h4>
              <p>Extensive network across 195 countries worldwide</p>
            </div>
            <div className="feature">
              <h4>Competitive Pricing</h4>
              <p>Best rates with transparent pricing structure</p>
            </div>
            <div className="feature">
              <h4>Expert Team</h4>
              <p>Professional logistics experts ready to assist</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">"SwiftChain Logistics revolutionized our supply chain management. Fast, reliable, and professional service!"</p>
              <p className="testimonial-author">- John Smith, ABC Corporation</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">"Best logistics provider we've worked with. Their tracking system is accurate and customer support is excellent."</p>
              <p className="testimonial-author">- Sarah Johnson, Global Retail Co</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">"Competitive pricing combined with reliable service makes SwiftChain our go-to logistics partner."</p>
              <p className="testimonial-author">- Michael Chen, Tech Imports Ltd</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of businesses using SwiftChain Logistics</p>
          <Link to="/contact" className="btn btn-primary btn-lg">Contact Us Today</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SwiftChain Logistics</h4>
              <p>Your trusted logistics partner for global shipping solutions</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/careers">Careers</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@swiftchain.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms & Conditions</Link></li>
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

export default Home;
