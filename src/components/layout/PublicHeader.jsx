import React from 'react';
import { Link } from 'react-router-dom';

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">SwiftChain Logistics</Link>
        
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          <Link to="/services" className="text-gray-700 hover:text-blue-600">Services</Link>
          <Link to="/track" className="text-gray-700 hover:text-blue-600">Track</Link>
          <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
          <Link to="/admin/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Admin
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 p-4 border-t">
          <Link to="/" className="block py-2 text-gray-700">Home</Link>
          <Link to="/about" className="block py-2 text-gray-700">About</Link>
          <Link to="/services" className="block py-2 text-gray-700">Services</Link>
          <Link to="/track" className="block py-2 text-gray-700">Track</Link>
          <Link to="/pricing" className="block py-2 text-gray-700">Pricing</Link>
          <Link to="/contact" className="block py-2 text-gray-700">Contact</Link>
          <Link to="/admin/login" className="block py-2 text-blue-600 font-semibold">Admin</Link>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
