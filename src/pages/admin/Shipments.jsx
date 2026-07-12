import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';

const Shipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    receiver_name: '',
    receiver_email: '',
    receiver_phone: '',
    receiver_address: '',
    origin: '',
    destination: '',
    shipping_method: 'Road Freight',
    weight: '',
    package_type: '',
    declared_value: '',
    shipping_cost: '',
    notes: ''
  });

  useEffect(() => {
    fetchShipments();
  }, [page, search, status]);

  const fetchShipments = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const response = await api.get(`/shipments?${params.toString()}`);
      setShipments(response.data || []);
    } catch (err) {
      setError('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (shipment = null) => {
    if (shipment) {
      setEditingId(shipment.id);
      setFormData(shipment);
    } else {
      setEditingId(null);
      setFormData({
        customer_id: '',
        receiver_name: '',
        receiver_email: '',
        receiver_phone: '',
        receiver_address: '',
        origin: '',
        destination: '',
        shipping_method: 'Road Freight',
        weight: '',
        package_type: '',
        declared_value: '',
        shipping_cost: '',
        notes: ''
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/shipments/${editingId}`, formData);
      } else {
        await api.post('/shipments', formData);
      }
      setModalOpen(false);
      fetchShipments();
    } catch (err) {
      setError('Failed to save shipment');
    }
  };

  const handleDelete = async (shipment) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete_(`/shipments/${shipment.id}`);
        fetchShipments();
      } catch (err) {
        setError('Failed to delete shipment');
      }
    }
  };

  const columns = [
    { key: 'tracking_number', label: 'Tracking #' },
    { key: 'receiver_name', label: 'Receiver' },
    { key: 'origin', label: 'From' },
    { key: 'destination', label: 'To' },
    {
      key: 'shipment_status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded text-white text-sm ${
          status === 'Delivered' ? 'bg-green-600' :
          status === 'In Transit' ? 'bg-blue-600' :
          status === 'Shipment Created' ? 'bg-gray-600' :
          'bg-orange-600'
        }`}>
          {status}
        </span>
      )
    },
    { key: 'shipping_cost', label: 'Cost' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipments</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>New Shipment</Button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Search tracking number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Shipment Created">Created</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading shipments...</div>
        ) : (
          <Table
            columns={columns}
            data={shipments}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Shipment' : 'New Shipment'}
        size="xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Receiver Name"
            value={formData.receiver_name}
            onChange={(e) => setFormData({...formData, receiver_name: e.target.value})}
            required
          />
          <Input
            label="Receiver Email"
            type="email"
            value={formData.receiver_email}
            onChange={(e) => setFormData({...formData, receiver_email: e.target.value})}
          />
          <Input
            label="Receiver Phone"
            value={formData.receiver_phone}
            onChange={(e) => setFormData({...formData, receiver_phone: e.target.value})}
          />
          <Input
            label="Receiver Address"
            value={formData.receiver_address}
            onChange={(e) => setFormData({...formData, receiver_address: e.target.value})}
          />
          <Input
            label="Origin"
            value={formData.origin}
            onChange={(e) => setFormData({...formData, origin: e.target.value})}
            required
          />
          <Input
            label="Destination"
            value={formData.destination}
            onChange={(e) => setFormData({...formData, destination: e.target.value})}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
            <select
              value={formData.shipping_method}
              onChange={(e) => setFormData({...formData, shipping_method: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Air Freight</option>
              <option>Ocean Freight</option>
              <option>Road Freight</option>
              <option>Express Delivery</option>
            </select>
          </div>
          <Input
            label="Weight (kg)"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
          />
          <Input
            label="Package Type"
            value={formData.package_type}
            onChange={(e) => setFormData({...formData, package_type: e.target.value})}
          />
          <Input
            label="Declared Value"
            type="number"
            value={formData.declared_value}
            onChange={(e) => setFormData({...formData, declared_value: e.target.value})}
          />
          <Input
            label="Shipping Cost"
            type="number"
            value={formData.shipping_cost}
            onChange={(e) => setFormData({...formData, shipping_cost: e.target.value})}
          />
        </div>
        <Input
          label="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="mt-4"
        />
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Shipments;
