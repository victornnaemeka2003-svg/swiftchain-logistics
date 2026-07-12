import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'Viewer',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users');
      setUsers(response || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setFormData({ ...user, password: '' });
    } else {
      setEditingId(null);
      setFormData({
        email: '',
        full_name: '',
        role: 'Viewer',
        password: ''
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await api.put(`/users/${editingId}`, updateData);
      } else {
        await api.post('/users', formData);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to save user');
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete_(`/users/${user.id}`);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Name' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded text-white text-sm ${
          status === 'Active' ? 'bg-green-600' : 'bg-gray-600'
        }`}>
          {status}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        {currentUser?.role === 'Super Admin' && (
          <Button variant="primary" onClick={() => handleOpenModal()}>Add User</Button>
        )}
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <Card>
        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <Table
            columns={columns}
            data={users}
            onEdit={currentUser?.role === 'Super Admin' ? handleOpenModal : null}
            onDelete={currentUser?.role === 'Super Admin' ? handleDelete : null}
          />
        )}
      </Card>

      {currentUser?.role === 'Super Admin' && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingId ? 'Edit User' : 'Add User'}
        >
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
            {!editingId && (
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Staff</option>
                <option>Viewer</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-6">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Users;
