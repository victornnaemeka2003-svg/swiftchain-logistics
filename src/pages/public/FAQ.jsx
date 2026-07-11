import React from 'react';
import { Link } from 'react-router-dom';

function FAQ() {
  const [expandedId, setExpandedId] = React.useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How long does shipping usually take?',
      answer: 'Shipping time depends on the method: Air Freight (2-5 days), Ocean Freight (10-30 days), Road Freight (3-7 days). Express options available.'
    },
    {
      id: 2,
      question: 'How can I track my shipment?',
      answer: 'You can track your shipment using your tracking number on our website. Real-time updates are provided via email and SMS.'
    },
    {
      id: 3,
      question: 'What are your rates?',
      answer: 'Rates depend on shipment weight, dimensions, origin, destination, and method. Request a quote on our pricing page.'
    },
    {
      id: 4,
      question: 'Do you handle fragile items?',
      answer: 'Yes, we have specialized handling for fragile and valuable items with appropriate packaging and insurance options.'
    }
  ];

  return (
    <div className="public-page">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="logo">⚡ SwiftChain Logistics</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login" className="btn-login">Login</Link></li>
          </ul>
        </div>
      </nav>

      <section className="page-hero">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map(faq => (
            <div key={faq.id} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  background: expandedId === faq.id ? '#f3f4f6' : 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {faq.question}
                <span style={{ fontSize: '1.5rem' }}>{expandedId === faq.id ? '−' : '+'}</span>
              </button>
              {expandedId === faq.id && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
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

export default FAQ;
