import React from 'react';

const PublicFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">SwiftChain Logistics</h3>
            <p className="text-sm">Global logistics solutions for your business needs.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Services</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white">Air Freight</a></li>
              <li><a href="#" className="hover:text-white">Ocean Freight</a></li>
              <li><a href="#" className="hover:text-white">Road Freight</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <p className="text-sm">Email: info@swiftchain.com</p>
            <p className="text-sm">Phone: +1-800-SWIFT</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2026 SwiftChain Logistics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
