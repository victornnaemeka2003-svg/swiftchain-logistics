import React, { useState, useEffect } from 'react';
import '../../styles/admin/Management.css';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [action, entityType]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/audit-logs';
      const params = new URLSearchParams();
      if (action) params.append('action', action);
      if (entityType) params.append('entity_type', entityType);
      if (params.toString()) url += '?' + params.toString();

      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setLogs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-container">
      <h1>Audit Logs</h1>

      <div className="filter-bar">
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
        </select>
        <select value={entityType} onChange={(e) => setEntityType(e.target.value)}>
          <option value="">All Entities</option>
          <option value="user">User</option>
          <option value="customer">Customer</option>
          <option value="shipment">Shipment</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading logs...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.user_name || 'System'}</td>
                    <td>{log.action}</td>
                    <td>{log.entity_type}</td>
                    <td>{log.entity_id}</td>
                    <td>{log.ip_address}</td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;
