import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response);
      } catch (err) {
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Shipments</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalShipments || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{stats?.deliveredShipments || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">In Transit</p>
            <p className="text-3xl font-bold text-orange-600">{stats?.activeShipments || 0}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Revenue</p>
            <p className="text-3xl font-bold text-purple-600">${stats?.revenue || 0}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="space-y-2 text-sm">
            <p>Pending Shipments: <span className="font-bold">{stats?.pendingShipments}</span></p>
            <p>Customers: <span className="font-bold">{stats?.customers}</span></p>
            <p>Drivers: <span className="font-bold">{stats?.drivers}</span></p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Button variant="primary" size="sm" className="w-full">New Shipment</Button>
            <Button variant="secondary" size="sm" className="w-full">New Customer</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
