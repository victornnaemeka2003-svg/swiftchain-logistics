import React from 'react';
import Button from '../../components/ui/Button';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Global Logistics Solutions</h1>
          <p className="text-xl mb-8 opacity-90">Fast, reliable, and secure shipping worldwide</p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg" onClick={() => window.location.href = '/track'}>
              Track Shipment
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/pricing'}>
              Get Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Tracking Search */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Track Your Shipment</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter tracking number..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="primary">Search</Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✈️', title: 'Air Freight', desc: 'Fast international shipping' },
              { icon: '🚢', title: 'Ocean Freight', desc: 'Cost-effective bulk shipping' },
              { icon: '🚛', title: 'Road Freight', desc: 'Reliable ground transportation' }
            ].map((service, i) => (
              <div key={i} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose SwiftChain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: '50+', desc: 'Years Experience' },
              { label: '150', desc: 'Countries Served' },
              { label: '10M+', desc: 'Shipments Delivered' },
              { label: '99.9%', desc: 'On-Time Delivery' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">{stat.label}</p>
                <p className="text-gray-600">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
