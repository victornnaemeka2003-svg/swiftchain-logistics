import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin/Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>⚡ SwiftChain</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item active">📊 Dashboard</Link>
          <Link to="/admin/shipments" className="nav-item">📦 Shipments</Link>
          <Link to="/admin/customers" className="nav-item">👥 Customers</Link>
          <Link to="/admin/users" className="nav-item">👤 Users</Link>
          <Link to="/admin/reports" className="nav-item">📈 Reports</Link>
          <Link to="/admin/audit-logs" className="nav-item">📋 Audit Logs</Link>
          <Link to="/admin/settings" className="nav-item">⚙️ Settings</Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <h1>Dashboard</h1>
          <div className="top-bar-right">
            <span className="user-name">{user?.full_name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </header>

        {loading ? (
          <div className="loading">Loading dashboard...</div>
        ) : stats ? (
          <div className="dashboard-content">
            {/* Stats Grid */}
            <section className="stats-grid">
              <div className="stat-card">
                <h3>Total Shipments</h3>
                <p className="stat-value">{stats.stats.shipments.total || 0}</p>
              </div>
              <div className="stat-card success">
                <h3>Delivered</h3>
                <p className="stat-value">{stats.stats.shipments.delivered || 0}</p>
              </div>
              <div className="stat-card info">
                <h3>Active</h3>
                <p className="stat-value">{stats.stats.shipments.active || 0}</p>
              </div>
              <div className="stat-card warning">
                <h3>Pending</h3>
                <p className="stat-value">{stats.stats.shipments.pending || 0}</p>
              </div>
              <div className="stat-card danger">
                <h3>Cancelled</h3>
                <p className="stat-value">{stats.stats.shipments.cancelled || 0}</p>
              </div>
              <div className="stat-card primary">
                <h3>Revenue</h3>
                <p className="stat-value">${(stats.stats.revenue.total_revenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="stat-card">
                <h3>Total Customers</h3>
                <p className="stat-value">{stats.stats.customers.total_customers || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Active Drivers</h3>
                <p className="stat-value">{stats.stats.drivers.total_drivers || 0}</p>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="recent-activity">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-icon">
                        {activity.action === 'CREATE' && '✨'}
                        {activity.action === 'UPDATE' && '🔄'}
                        {activity.action === 'DELETE' && '🗑️'}
                        {activity.action === 'LOGIN' && '🔓'}
                        {activity.action === 'LOGOUT' && '🔒'}
                      </div>
                      <div className="activity-details">
                        <p className="activity-action">
                          <strong>{activity.user_name || 'System'}</strong> {activity.action.toLowerCase()}'d {activity.entity_type}
                        </p>
                        <p className="activity-time">{new Date(activity.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ padding: '1rem', color: '#6b7280' }}>No recent activity</p>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="error">Failed to load dashboard</div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
