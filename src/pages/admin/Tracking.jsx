import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Card from '../../components/ui/Card';

const Tracking = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [formData, setFormData] = useState({
    event_date: new Date().toISOString().split('T')[0],
    location: '',
    status: 'In Transit',
    description: ''
  });

  useEffect(() => {
    fetchShipments();
  }, [search]);

  const fetchShipments = async () => {
    setLoading(true);
    setError('');
    try {
      let url = '/shipments?limit=100';
      if (search) url += `&search=${search}`;
      const response = await api.get(url);
      setShipments(response.data || []);
    } catch (err) {
      setError('Failed to load shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTracking = (shipment) => {
    setSelectedShipment(shipment);
    setFormData({
      event_date: new Date().toISOString().split('T')[0],
      location: '',
      status: 'In Transit',
      description: ''
    });
    setModalOpen(true);
  };

  const handleSaveTracking = async () => {
    try {
      await api.post('/tracking', {
        shipment_id: selectedShipment.id,
        ...formData
      });
      setModalOpen(false);
      fetchShipments();
    } catch (err) {
      setError('Failed to add tracking event');
    }
  };

  const statusColors = {
    'Shipment Created': 'bg-gray-100',
    'Package Received': 'bg-blue-100',
    'In Transit': 'bg-orange-100',
    'Arrived at Hub': 'bg-purple-100',
    'Out for Delivery': 'bg-blue-100',
    'Delivered': 'bg-green-100',
    'Delivery Failed': 'bg-red-100'
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tracking Management</h1>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <Card className="mb-6">
        <Input
          placeholder="Search by tracking number or shipment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {loading ? (
        <div className="text-center py-8">Loading shipments...</div>
      ) : (
        <div className="space-y-4">
          {shipments.map((shipment) => (
            <Card key={shipment.id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold">Tracking: {shipment.tracking_number}</p>
                  <p className="text-gray-600 text-sm">{shipment.origin} → {shipment.destination}</p>
                  <p className="text-sm mt-2">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      shipment.shipment_status === 'Delivered' ? 'bg-green-600' :
                      shipment.shipment_status === 'In Transit' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }`}>
                      {shipment.shipment_status}
                    </span>
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddTracking(shipment)}
                >
                  Add Event
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Tracking Event"
      >
        <div className="space-y-4">
          <Input
            label="Event Date"
            type="date"
            value={formData.event_date}
            onChange={(e) => setFormData({...formData, event_date: e.target.value})}
          />
          <Input
            label="Location"
            placeholder="Enter location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Shipment Created</option>
              <option>Package Received</option>
              <option>Customs Clearance</option>
              <option>In Transit</option>
              <option>Arrived at Hub</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>Delivery Failed</option>
              <option>Returned</option>
            </select>
          </div>
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveTracking}>Save Event</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Tracking;
