import React, { useState, useEffect } from 'react';
import { apiPost, apiDelete, apiPut } from '../../api/client';
import '../../styles/admin/Management.css';

function ShipmentManagement() {
  const [shipments, setShipments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    sender_address: '',
    receiver_name: '',
    receiver_email: '',
    receiver_phone: '',
    receiver_address: '',
    origin_city: '',
    origin_country: '',
    destination_city: '',
    destination_country: '',
    shipping_method: 'road',
    weight: '',
    declared_value: '',
    shipping_cost: ''
  });

  useEffect(() => {
    fetchShipments();
  }, [page, status]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      let url = `/api/shipments/list?page=${page}&limit=50`;
      if (status) url += `&status=${status}`;
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setShipments(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShipment = async (e) => {
    e.preventDefault();
    try {
      await apiPost('/shipments/create', { shipmentData: formData });
      setShowForm(false);
      setFormData({
        customer_id: '',
        sender_name: '',
        sender_email: '',
        sender_phone: '',
        sender_address: '',
        receiver_name: '',
        receiver_email: '',
        receiver_phone: '',
        receiver_address: '',
        origin_city: '',
        origin_country: '',
        destination_city: '',
        destination_country: '',
        shipping_method: 'road',
        weight: '',
        declared_value: '',
        shipping_cost: ''
      });
      fetchShipments();
    } catch (error) {
      alert('Error creating shipment: ' + error.message);
    }
  };

  const handleDeleteShipment = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await apiDelete(`/shipments/${id}`);
        fetchShipments();
      } catch (error) {
        alert('Error deleting shipment: ' + error.message);
      }
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Shipment Management</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">+ Create Shipment</button>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <select value={status} onChange={(e) => {
          setStatus(e.target.value);
          setPage(1);
        }}>
          <option value="">All Status</option>
          <option value="created">Created</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Shipment</h2>
            <form onSubmit={handleCreateShipment}>
              <div className="form-grid">
                <input type="text" placeholder="Sender Name *" value={formData.sender_name} onChange={(e) => setFormData({...formData, sender_name: e.target.value})} required />
                <input type="email" placeholder="Sender Email" value={formData.sender_email} onChange={(e) => setFormData({...formData, sender_email: e.target.value})} />
                <input type="tel" placeholder="Sender Phone" value={formData.sender_phone} onChange={(e) => setFormData({...formData, sender_phone: e.target.value})} />
                <input type="text" placeholder="Sender Address" value={formData.sender_address} onChange={(e) => setFormData({...formData, sender_address: e.target.value})} required />
                <input type="text" placeholder="Receiver Name *" value={formData.receiver_name} onChange={(e) => setFormData({...formData, receiver_name: e.target.value})} required />
                <input type="email" placeholder="Receiver Email" value={formData.receiver_email} onChange={(e) => setFormData({...formData, receiver_email: e.target.value})} />
                <input type="tel" placeholder="Receiver Phone" value={formData.receiver_phone} onChange={(e) => setFormData({...formData, receiver_phone: e.target.value})} />
                <input type="text" placeholder="Receiver Address" value={formData.receiver_address} onChange={(e) => setFormData({...formData, receiver_address: e.target.value})} required />
                <input type="text" placeholder="Origin City" value={formData.origin_city} onChange={(e) => setFormData({...formData, origin_city: e.target.value})} />
                <input type="text" placeholder="Origin Country *" value={formData.origin_country} onChange={(e) => setFormData({...formData, origin_country: e.target.value})} required />
                <input type="text" placeholder="Destination City" value={formData.destination_city} onChange={(e) => setFormData({...formData, destination_city: e.target.value})} />
                <input type="text" placeholder="Destination Country *" value={formData.destination_country} onChange={(e) => setFormData({...formData, destination_country: e.target.value})} required />
                <select value={formData.shipping_method} onChange={(e) => setFormData({...formData, shipping_method: e.target.value})}>
                  <option value="road">Road</option>
                  <option value="air">Air</option>
                  <option value="ocean">Ocean</option>
                  <option value="express">Express</option>
                </select>
                <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                <input type="number" placeholder="Declared Value" value={formData.declared_value} onChange={(e) => setFormData({...formData, declared_value: e.target.value})} />
                <input type="number" placeholder="Shipping Cost" value={formData.shipping_cost} onChange={(e) => setFormData({...formData, shipping_cost: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create Shipment</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="loading">Loading shipments...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Method</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length > 0 ? (
                shipments.map(shipment => (
                  <tr key={shipment.id}>
                    <td>{shipment.tracking_number}</td>
                    <td>{shipment.origin_city}, {shipment.origin_country}</td>
                    <td>{shipment.destination_city}, {shipment.destination_country}</td>
                    <td><span className={`status-badge status-${shipment.shipment_status}`}>{shipment.shipment_status.replace('_', ' ')}</span></td>
                    <td>{shipment.shipping_method}</td>
                    <td>${shipment.shipping_cost || 0}</td>
                    <td className="actions">
                      <button onClick={() => handleDeleteShipment(shipment.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No shipments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShipmentManagement;
