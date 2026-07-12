import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    warehouse_name: '',
    location: '',
    city: '',
    state: '',
    country: '',
    contact_person: '',
    contact_phone: '',
    total_capacity: ''
  });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/warehouses');
      setWarehouses(response || []);
    } catch (err) {
      setError('Failed to load warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (warehouse = null) => {
    if (warehouse) {
      setEditingId(warehouse.id);
      setFormData(warehouse);
    } else {
      setEditingId(null);
      setFormData({
        warehouse_name: '',
        location: '',
        city: '',
        state: '',
        country: '',
        contact_person: '',
        contact_phone: '',
        total_capacity: ''
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/warehouses/${editingId}`, formData);
      } else {
        await api.post('/warehouses', formData);
      }
      setModalOpen(false);
      fetchWarehouses();
    } catch (err) {
      setError('Failed to save warehouse');
    }
  };

  const handleDelete = async (warehouse) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete_(`/warehouses/${warehouse.id}`);
        fetchWarehouses();
      } catch (err) {
        setError('Failed to delete warehouse');
      }
    }
  };

  const columns = [
    { key: 'warehouse_name', label: 'Warehouse' },
    { key: 'location', label: 'Location' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'contact_person', label: 'Contact' },
    {
      key: 'total_capacity',
      label: 'Capacity',
      render: (capacity) => `${capacity} units`
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warehouses</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>Add Warehouse</Button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <Card>
        {loading ? (
          <div className="text-center py-8">Loading warehouses...</div>
        ) : (
          <Table
            columns={columns}
            data={warehouses}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Warehouse' : 'Add Warehouse'}
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Warehouse Name"
            value={formData.warehouse_name}
            onChange={(e) => setFormData({...formData, warehouse_name: e.target.value})}
            required
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          />
          <Input
            label="State"
            value={formData.state}
            onChange={(e) => setFormData({...formData, state: e.target.value})}
          />
          <Input
            label="Country"
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
          />
          <Input
            label="Contact Person"
            value={formData.contact_person}
            onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
          />
          <Input
            label="Contact Phone"
            value={formData.contact_phone}
            onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
          />
          <Input
            label="Total Capacity"
            type="number"
            value={formData.total_capacity}
            onChange={(e) => setFormData({...formData, total_capacity: e.target.value})}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Warehouses;
