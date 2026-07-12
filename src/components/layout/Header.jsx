import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">SwiftChain</h1>
          <div className="hidden md:flex gap-6">
            <a href="/admin/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="/admin/customers" className="text-gray-700 hover:text-blue-600">Customers</a>
            <a href="/admin/shipments" className="text-gray-700 hover:text-blue-600">Shipments</a>
            <a href="/admin/drivers" className="text-gray-700 hover:text-blue-600">Drivers</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user?.full_name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
