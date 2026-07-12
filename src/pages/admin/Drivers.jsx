import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    vehicle_type: '',
    vehicle_registration: '',
    license_number: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchDrivers();
  }, [page]);

  const fetchDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/drivers?page=${page}&limit=10`);
      setDrivers(response.data || []);
    } catch (err) {
      setError('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (driver = null) => {
    if (driver) {
      setEditingId(driver.id);
      setFormData(driver);
    } else {
      setEditingId(null);
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        vehicle_type: '',
        vehicle_registration: '',
        license_number: '',
        status: 'Active'
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/drivers/${editingId}`, formData);
      } else {
        await api.post('/drivers', formData);
      }
      setModalOpen(false);
      fetchDrivers();
    } catch (err) {
      setError('Failed to save driver');
    }
  };

  const handleDelete = async (driver) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete_(`/drivers/${driver.id}`);
        fetchDrivers();
      } catch (err) {
        setError('Failed to delete driver');
      }
    }
  };

  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'vehicle_type', label: 'Vehicle' },
    { key: 'license_number', label: 'License #' },
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
        <h1 className="text-3xl font-bold">Drivers</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>Add Driver</Button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <Card>
        {loading ? (
          <div className="text-center py-8">Loading drivers...</div>
        ) : (
          <Table
            columns={columns}
            data={drivers}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Driver' : 'Add Driver'}
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            required
          />
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Input
            label="Vehicle Type"
            value={formData.vehicle_type}
            onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
          />
          <Input
            label="Vehicle Registration"
            value={formData.vehicle_registration}
            onChange={(e) => setFormData({...formData, vehicle_registration: e.target.value})}
          />
          <Input
            label="License Number"
            value={formData.license_number}
            onChange={(e) => setFormData({...formData, license_number: e.target.value})}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Drivers;
