import React, { useState, useEffect } from 'react';
import { apiPost } from '../../api/client';
import '../../styles/admin/Management.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role_id: 2
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/admin/users/create', formData);
      setShowForm(false);
      setFormData({ email: '', password: '', full_name: '', role_id: 2 });
      fetchUsers();
    } catch (error) {
      alert('Error creating user: ' + error.message);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>User Management</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">+ Add User</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <form onSubmit={handleCreateUser}>
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password *"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
              <select value={formData.role_id} onChange={(e) => setFormData({...formData, role_id: e.target.value})}>
                <option value="2">Admin</option>
                <option value="3">Manager</option>
                <option value="4">Staff</option>
                <option value="5">Viewer</option>
              </select>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create User</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td><span className={`status-badge status-${user.status}`}>{user.status}</span></td>
                    <td>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
