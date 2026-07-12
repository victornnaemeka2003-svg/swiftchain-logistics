import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Customers', href: '/admin/customers' },
    { label: 'Shipments', href: '/admin/shipments' },
    { label: 'Tracking', href: '/admin/tracking' },
    { label: 'Drivers', href: '/admin/drivers' },
    { label: 'Warehouses', href: '/admin/warehouses' },
    { label: 'Invoices', href: '/admin/invoices' },
    { label: 'Reports', href: '/admin/reports' }
  ];

  const adminMenuItems = [
    { label: 'Settings', href: '/admin/settings' },
    { label: 'Users', href: '/admin/users' }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400">SwiftChain</h2>
        <p className="text-gray-400 text-sm mt-1">Logistics Management</p>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {item.label}
          </Link>
        ))}

        {(user?.role === 'Super Admin' || user?.role === 'Admin') && (
          <>
            <hr className="my-4 border-gray-700" />
            {adminMenuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
