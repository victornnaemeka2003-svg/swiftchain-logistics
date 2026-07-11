import React from 'react';
import { Link } from 'react-router-dom';

function Services() {
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
          <h2>Our Services</h2>
          <p>Comprehensive logistics solutions for every need</p>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div className="services-detail">
          <div className="service-detail-card">
            <h3>✈️ Air Freight</h3>
            <p>Fast international shipping via air cargo. Ideal for time-sensitive shipments and perishable goods.</p>
            <ul>
              <li>Express delivery worldwide</li>
              <li>Temperature-controlled options</li>
              <li>Real-time tracking</li>
              <li>Door-to-door service</li>
            </ul>
          </div>

          <div className="service-detail-card">
            <h3>🚢 Ocean Freight</h3>
            <p>Economical sea shipping for large volumes. Perfect for cost-effective international transport.</p>
            <ul>
              <li>Full container loads (FCL)</li>
              <li>Less than container loads (LCL)</li>
              <li>Containerized and breakbulk cargo</li>
              <li>Customs clearance assistance</li>
            </ul>
          </div>

          <div className="service-detail-card">
            <h3>🚚 Road Freight</h3>
            <p>Reliable ground transportation across regions. Flexible and cost-efficient for regional deliveries.</p>
            <ul>
              <li>Direct shipments</li>
              <li>Consolidated shipments</li>
              <li>Specialized handling</li>
              <li>GPS tracking</li>
            </ul>
          </div>

          <div className="service-detail-card">
            <h3>📦 Warehousing & Storage</h3>
            <p>Secure storage and inventory management. State-of-the-art facilities for your peace of mind.</p>
            <ul>
              <li>Climate-controlled storage</li>
              <li>Inventory management</li>
              <li>Order fulfillment</li>
              <li>Distribution centers</li>
            </ul>
          </div>
        </div>
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

export default Services;
